import 'dart:io' show Platform;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:livekit_client/livekit_client.dart';
// ignore: depend_on_referenced_packages
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:flutter_background/flutter_background.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import '../theme.dart';
import '../widgets/duet_button.dart';

class MeetingPage extends StatefulWidget {
  final String code;
  final String url;
  final String token;
  final String name;
  final bool isHost;
  final String? hostToken;
  final bool initialMicOn;
  final bool initialCamOn;

  const MeetingPage({
    super.key,
    required this.code,
    required this.url,
    required this.token,
    required this.name,
    required this.isHost,
    this.hostToken,
    this.initialMicOn = true,
    this.initialCamOn = false,
  });

  @override
  State<MeetingPage> createState() => _MeetingPageState();
}

class ScreenFeed {
  final String title;
  final bool isSelf;
  final VideoTrack track;

  ScreenFeed({
    required this.title,
    required this.isSelf,
    required this.track,
  });
}

class ParticipantItem {
  final String name;
  final bool isSelf;
  final bool isMicOn;
  final bool isCamOn;
  final VideoTrack? cameraTrack;

  ParticipantItem({
    required this.name,
    required this.isSelf,
    required this.isMicOn,
    required this.isCamOn,
    this.cameraTrack,
  });
}

class _MeetingPageState extends State<MeetingPage> {
  Room? _room;
  EventsListener<RoomEvent>? _listener;
  late bool _micOn;
  late bool _camOn;
  String _currentTime = '';
  Timer? _clockTimer;

  @override
  void initState() {
    super.initState();
    _micOn = widget.initialMicOn;
    _camOn = widget.initialCamOn;
    _updateTime();
    _clockTimer = Timer.periodic(const Duration(seconds: 30), (_) => _updateTime());
    _initAndroidBackground();
    _connect();
  }

  Future<void> _initAndroidBackground() async {
    if (Platform.isAndroid) {
      const androidConfig = FlutterBackgroundAndroidConfig(
        notificationTitle: 'Duet Screen Sharing',
        notificationText: 'You are sharing your screen in Duet.',
        notificationImportance: AndroidNotificationImportance.normal,
        notificationIcon: AndroidResource(
          name: 'ic_launcher',
          defType: 'mipmap',
        ),
      );
      try {
        await FlutterBackground.initialize(androidConfig: androidConfig);
      } catch (_) {}
    }
  }

  void _updateTime() {
    final now = DateTime.now();
    final hour = now.hour.toString().padLeft(2, '0');
    final minute = now.minute.toString().padLeft(2, '0');
    if (mounted) {
      setState(() {
        _currentTime = '$hour:$minute';
      });
    }
  }

  Future<void> _connect() async {
    final room = Room();
    _room = room;
    room.addListener(_onRoomChanged);

    _listener = room.createListener();
    _listener?.on<LocalTrackUnpublishedEvent>((event) {
      if (event.publication.source == TrackSource.screenShareVideo) {
        if (Platform.isAndroid && FlutterBackground.isBackgroundExecutionEnabled) {
          FlutterBackground.disableBackgroundExecution();
        }
        if (mounted) setState(() {});
      }
    });

    try {
      await [Permission.microphone, Permission.camera].request();
      await room.connect(widget.url, widget.token);
      await room.localParticipant?.setMicrophoneEnabled(_micOn);
      await room.localParticipant?.setCameraEnabled(_camOn);

      if (mounted) {
        setState(() {});
      }
    } catch (_) {}
  }

  void _onRoomChanged() {
    if (mounted) setState(() {});
  }

  Future<void> _toggleMic() async {
    final p = _room?.localParticipant;
    if (p == null) return;
    final next = !_micOn;
    await p.setMicrophoneEnabled(next);
    setState(() => _micOn = next);
  }

  Future<void> _toggleCam() async {
    final p = _room?.localParticipant;
    if (p == null) return;
    final next = !_camOn;
    await p.setCameraEnabled(next);
    setState(() => _camOn = next);
  }

  Future<void> _toggleShare() async {
    final p = _room?.localParticipant;
    if (p == null) return;
    final isSharing = p.isScreenShareEnabled();

    try {
      if (!isSharing) {
        // START SCREEN SHARING
        if (Platform.isAndroid) {
          final hasCapturePermission = await Helper.requestCapturePermission();
          if (!hasCapturePermission) return;

          const androidConfig = FlutterBackgroundAndroidConfig(
            notificationTitle: 'Duet Screen Sharing',
            notificationText: 'You are sharing your screen in Duet.',
            notificationImportance: AndroidNotificationImportance.normal,
            notificationIcon: AndroidResource(
              name: 'ic_launcher',
              defType: 'mipmap',
            ),
          );
          await FlutterBackground.initialize(androidConfig: androidConfig);
          if (!FlutterBackground.isBackgroundExecutionEnabled) {
            await FlutterBackground.enableBackgroundExecution();
          }
        }

        await p.setScreenShareEnabled(true, captureScreenAudio: true);
        if (mounted) setState(() {});
      } else {
        // STOP SCREEN SHARING CLEANLY
        await _cleanStopScreenShare();
      }
    } catch (e) {
      if (Platform.isAndroid && FlutterBackground.isBackgroundExecutionEnabled) {
        try {
          await FlutterBackground.disableBackgroundExecution();
        } catch (_) {}
      }
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Screen share error: $e'),
          backgroundColor: DuetColors.danger,
        ),
      );
    }
  }

  Future<void> _cleanStopScreenShare() async {
    final p = _room?.localParticipant;
    if (p == null) return;

    try {
      // 1. Explicitly unpublish all screen share tracks
      final screenPubs = p.videoTrackPublications
          .where((pub) => pub.source == TrackSource.screenShareVideo)
          .toList();
      for (final pub in screenPubs) {
        try {
          await pub.track?.stop();
        } catch (_) {}
        try {
          await p.removePublishedTrack(pub.sid);
        } catch (_) {}
      }

      // 2. Also unpublish any screen share audio
      final screenAudioPubs = p.audioTrackPublications
          .where((pub) => pub.source == TrackSource.screenShareAudio)
          .toList();
      for (final pub in screenAudioPubs) {
        try {
          await pub.track?.stop();
        } catch (_) {}
        try {
          await p.removePublishedTrack(pub.sid);
        } catch (_) {}
      }

      await p.setScreenShareEnabled(false);
    } catch (_) {}

    // Allow LiveKit signaling to send the unpublish packet before killing service
    await Future.delayed(const Duration(milliseconds: 300));

    if (Platform.isAndroid && FlutterBackground.isBackgroundExecutionEnabled) {
      try {
        await FlutterBackground.disableBackgroundExecution();
      } catch (_) {}
    }

    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    _listener?.dispose();
    _room?.removeListener(_onRoomChanged);
    _room?.disconnect();
    if (Platform.isAndroid && FlutterBackground.isBackgroundExecutionEnabled) {
      FlutterBackground.disableBackgroundExecution();
    }
    super.dispose();
  }

  List<ScreenFeed> _getScreenFeeds() {
    final room = _room;
    if (room == null) return [];
    final feeds = <ScreenFeed>[];

    // 1. Local Screen Share (Your screen!)
    final localP = room.localParticipant;
    if (localP != null) {
      for (final pub in localP.videoTrackPublications) {
        if (pub.source == TrackSource.screenShareVideo && !pub.muted && pub.track != null) {
          feeds.add(ScreenFeed(
            title: '${widget.name} (Your Screen)',
            isSelf: true,
            track: pub.track!,
          ));
        }
      }
    }

    // 2. Remote Screen Shares
    for (final p in room.remoteParticipants.values) {
      final pName = p.name.isNotEmpty ? p.name : (p.identity.isNotEmpty ? p.identity : 'Guest');
      for (final pub in p.videoTrackPublications) {
        if (pub.source == TrackSource.screenShareVideo && !pub.muted && pub.track != null) {
          feeds.add(ScreenFeed(
            title: "$pName's Screen",
            isSelf: false,
            track: pub.track!,
          ));
        }
      }
    }

    return feeds;
  }

  List<ParticipantItem> _getParticipants() {
    final list = <ParticipantItem>[];

    // 1. Remote participants
    final remotes = _room?.remoteParticipants.values.toList() ?? [];
    for (final p in remotes) {
      final pName = p.name.isNotEmpty ? p.name : (p.identity.isNotEmpty ? p.identity : 'Guest');
      final camPub = p.videoTrackPublications
          .where((pub) => pub.source == TrackSource.camera && !pub.muted)
          .firstOrNull;
      list.add(ParticipantItem(
        name: pName,
        isSelf: false,
        isMicOn: !p.isMuted,
        isCamOn: camPub?.track != null,
        cameraTrack: camPub?.track,
      ));
    }

    // 2. Local participant (You)
    final localCamPub = _room?.localParticipant?.videoTrackPublications
        .where((pub) => pub.source == TrackSource.camera && !pub.muted)
        .firstOrNull;
    list.add(ParticipantItem(
      name: widget.name,
      isSelf: true,
      isMicOn: _micOn,
      isCamOn: _camOn,
      cameraTrack: localCamPub?.track,
    ));

    return list;
  }

  void _leaveCallDirectly() {
    _cleanStopScreenShare();
    _room?.disconnect();
    Navigator.of(context).pop();
  }

  Future<void> _endForEveryone() async {
    if (widget.hostToken != null) {
      try {
        final base = widget.url.replaceFirst('ws://', 'http://').replaceFirst('wss://', 'https://');
        await http.post(
          Uri.parse('$base/api/host/end'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'code': widget.code,
            'hostToken': widget.hostToken,
          }),
        );
      } catch (_) {}
    }
    _leaveCallDirectly();
  }

  void _showLeaveDialog() {
    showDialog(
      context: context,
      barrierColor: Colors.black87,
      builder: (ctx) => Dialog(
        backgroundColor: const Color(0xFF202124),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: Color(0xFF3C4043), width: 1),
        ),
        insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Leave call?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Are you sure you want to disconnect from this call?',
                style: TextStyle(
                  color: Color(0xFF9AA0A6),
                  fontSize: 13,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),

              // If host, offer End for everyone
              if (widget.isHost) ...[
                DuetButton(
                  text: 'End call for everyone',
                  icon: Icons.call_end_rounded,
                  variant: DuetButtonVariant.danger,
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    _endForEveryone();
                  },
                ),
                const SizedBox(height: 12),
              ],

              // Leave call button with tactile Claymorphism
              DuetButton(
                text: widget.isHost ? 'Just leave the call' : 'Leave call',
                icon: Icons.phone_disabled_rounded,
                variant: widget.isHost ? DuetButtonVariant.secondary : DuetButtonVariant.danger,
                onPressed: () {
                  Navigator.of(ctx).pop();
                  _leaveCallDirectly();
                },
              ),
              const SizedBox(height: 12),

              // Cancel button
              TextButton(
                style: TextButton.styleFrom(
                  foregroundColor: const Color(0xFF8AB4F8),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: const Text('Cancel', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                onPressed: () => Navigator.of(ctx).pop(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenFeeds = _getScreenFeeds();
    final participants = _getParticipants();
    final isSharing = _room?.localParticipant?.isScreenShareEnabled() ?? false;
    final totalCount = (_room?.remoteParticipants.length ?? 0) + 1;

    return Scaffold(
      backgroundColor: const Color(0xFF202124),
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar: Time | Code (tap to copy) ... Participant Badge
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Text(
                    _currentTime,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text('|', style: TextStyle(color: Colors.white30, fontSize: 13)),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: () {
                      Clipboard.setData(ClipboardData(text: widget.code));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Meeting code copied to clipboard'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(6),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            widget.code.toLowerCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.info_outline_rounded, size: 15, color: Colors.white60),
                        ],
                      ),
                    ),
                  ),
                  const Spacer(),

                  // Participant Badge with Critter Avatar
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF3C4043),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        ClipOval(
                          child: Container(
                            width: 18,
                            height: 18,
                            color: const Color(0xFFB6E3F4),
                            child: Image.network(
                              'https://api.dicebear.com/10.x/critters/png?seed=${Uri.encodeComponent(widget.name)}&size=64',
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  const Icon(Icons.person, size: 12, color: Colors.white),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '$totalCount',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Video Canvas: Screen share mode or All Participants grid
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                child: screenFeeds.isNotEmpty
                    ? _buildScreenShareLayout(screenFeeds, participants)
                    : _buildParticipantsView(participants),
              ),
            ),

            // Bottom Controls Dock
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E1F20).withValues(alpha: 0.95),
                      borderRadius: BorderRadius.circular(40),
                      border: Border.all(color: Colors.white10),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.black54,
                          offset: Offset(0, 8),
                          blurRadius: 20,
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Microphone Button
                        _buildControlButton(
                          icon: _micOn ? Icons.mic_rounded : Icons.mic_off_rounded,
                          isActive: _micOn,
                          isDanger: !_micOn,
                          onPressed: _toggleMic,
                          tooltip: _micOn ? 'Mute mic' : 'Unmute mic',
                        ),
                        const SizedBox(width: 12),

                        // Camera Button
                        _buildControlButton(
                          icon: _camOn ? Icons.videocam_rounded : Icons.videocam_off_rounded,
                          isActive: _camOn,
                          isDanger: !_camOn,
                          onPressed: _toggleCam,
                          tooltip: _camOn ? 'Turn off camera' : 'Turn on camera',
                        ),
                        const SizedBox(width: 12),

                        // Screen Share Button
                        _buildControlButton(
                          icon: isSharing ? Icons.stop_screen_share_rounded : Icons.screen_share_rounded,
                          isActive: true,
                          isAccent: isSharing,
                          onPressed: _toggleShare,
                          tooltip: isSharing ? 'Stop sharing' : 'Share screen',
                        ),
                        const SizedBox(width: 14),

                        // End Call Button
                        InkWell(
                          onTap: _showLeaveDialog,
                          borderRadius: BorderRadius.circular(28),
                          child: Container(
                            height: 48,
                            padding: const EdgeInsets.symmetric(horizontal: 22),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEA4335),
                              borderRadius: BorderRadius.circular(28),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x40EA4335),
                                  offset: Offset(0, 4),
                                  blurRadius: 10,
                                ),
                              ],
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.call_end_rounded,
                                color: Colors.white,
                                size: 22,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required bool isActive,
    bool isDanger = false,
    bool isAccent = false,
    required VoidCallback onPressed,
    required String tooltip,
  }) {
    Color bg = const Color(0xFF3C4043);
    Color fg = Colors.white;

    if (isDanger) {
      bg = const Color(0xFFEA4335);
      fg = Colors.white;
    } else if (isAccent) {
      bg = const Color(0xFF8AB4F8);
      fg = const Color(0xFF202124);
    }

    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(25),
        child: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: bg,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Icon(icon, color: fg, size: 20),
          ),
        ),
      ),
    );
  }

  /// Screen Share Presentation View (Shows your screen and/or other screens)
  Widget _buildScreenShareLayout(List<ScreenFeed> screenFeeds, List<ParticipantItem> participants) {
    return Column(
      children: [
        // 1. Main presentation screen(s)
        Expanded(
          child: screenFeeds.length == 1
              ? _buildSingleScreenTile(screenFeeds.first)
              : _buildMultiScreenGrid(screenFeeds),
        ),

        // 2. Horizontal strip of call participants while screenshare is ongoing
        if (participants.isNotEmpty) ...[
          const SizedBox(height: 10),
          SizedBox(
            height: 110,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: participants.length,
              separatorBuilder: (context, index) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                final p = participants[i];
                return SizedBox(
                  width: 110,
                  child: _buildParticipantTile(
                    p.name,
                    isSelf: p.isSelf,
                    isMicOn: p.isMicOn,
                    isCamOn: p.isCamOn,
                    cameraTrack: p.cameraTrack,
                    isCompact: true,
                  ),
                );
              },
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildSingleScreenTile(ScreenFeed feed) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF3C4043)),
        ),
        child: Stack(
          children: [
            Positioned.fill(
              child: VideoTrackRenderer(
                feed.track,
                fit: VideoViewFit.contain,
              ),
            ),
            Positioned(
              bottom: 12,
              left: 12,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF202124).withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFF8AB4F8),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      feed.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMultiScreenGrid(List<ScreenFeed> feeds) {
    return GridView.builder(
      itemCount: feeds.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 1.0,
      ),
      itemBuilder: (ctx, i) {
        final feed = feeds[i];
        return ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF3C4043)),
            ),
            child: Stack(
              children: [
                Positioned.fill(
                  child: VideoTrackRenderer(
                    feed.track,
                    fit: VideoViewFit.contain,
                  ),
                ),
                Positioned(
                  bottom: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF202124).withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Text(
                      feed.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  /// All Participants Grid (Google Meet mobile style)
  Widget _buildParticipantsView(List<ParticipantItem> participants) {
    if (participants.isEmpty) {
      return _buildParticipantTile(
        widget.name,
        isSelf: true,
        isMicOn: _micOn,
        isCamOn: _camOn,
      );
    }

    if (participants.length == 1) {
      final p = participants.first;
      return _buildParticipantTile(
        p.name,
        isSelf: p.isSelf,
        isMicOn: p.isMicOn,
        isCamOn: p.isCamOn,
        cameraTrack: p.cameraTrack,
      );
    }

    if (participants.length == 2) {
      // 1-on-1 Call: Vertical split view (Google Meet mobile standard)
      return Column(
        children: [
          Expanded(
            child: _buildParticipantTile(
              participants[0].name,
              isSelf: participants[0].isSelf,
              isMicOn: participants[0].isMicOn,
              isCamOn: participants[0].isCamOn,
              cameraTrack: participants[0].cameraTrack,
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: _buildParticipantTile(
              participants[1].name,
              isSelf: participants[1].isSelf,
              isMicOn: participants[1].isMicOn,
              isCamOn: participants[1].isCamOn,
              cameraTrack: participants[1].cameraTrack,
            ),
          ),
        ],
      );
    }

    // 3 or 4 participants: 2x2 grid
    if (participants.length <= 4) {
      return GridView.count(
        crossAxisCount: 2,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        childAspectRatio: 0.85,
        children: participants.map((p) {
          return _buildParticipantTile(
            p.name,
            isSelf: p.isSelf,
            isMicOn: p.isMicOn,
            isCamOn: p.isCamOn,
            cameraTrack: p.cameraTrack,
          );
        }).toList(),
      );
    }

    // 5+ participants: Scrollable 2-column grid
    return GridView.builder(
      itemCount: participants.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        childAspectRatio: 0.85,
      ),
      itemBuilder: (ctx, i) {
        final p = participants[i];
        return _buildParticipantTile(
          p.name,
          isSelf: p.isSelf,
          isMicOn: p.isMicOn,
          isCamOn: p.isCamOn,
          cameraTrack: p.cameraTrack,
        );
      },
    );
  }

  /// Google Meet Video/Avatar Tile
  Widget _buildParticipantTile(
    String name, {
    required bool isSelf,
    required bool isMicOn,
    required bool isCamOn,
    VideoTrack? cameraTrack,
    bool isCompact = false,
  }) {
    final critterUrl =
        'https://api.dicebear.com/10.x/critters/png?seed=${Uri.encodeComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=256';

    final hasVideo = cameraTrack != null && isCamOn;

    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF28292A),
        borderRadius: BorderRadius.circular(isCompact ? 14 : 20),
        border: Border.all(color: const Color(0xFF3C4043)),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            offset: Offset(0, 4),
            blurRadius: 10,
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 1. Video or Avatar Feed
          if (hasVideo)
            ClipRRect(
              borderRadius: BorderRadius.circular(isCompact ? 14 : 20),
              child: VideoTrackRenderer(
                cameraTrack,
                fit: VideoViewFit.cover,
              ),
            )
          else
            Center(
              child: Container(
                width: isCompact ? 52 : 96,
                height: isCompact ? 52 : 96,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF1E1F20),
                  border: Border.all(color: Colors.white12, width: 2),
                ),
                child: ClipOval(
                  child: Image.network(
                    critterUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Center(
                      child: Icon(Icons.person_rounded, size: isCompact ? 28 : 48, color: Colors.white70),
                    ),
                  ),
                ),
              ),
            ),

          // 2. Top-right Muted Mic Indicator
          if (!isMicOn)
            Positioned(
              top: isCompact ? 6 : 10,
              right: isCompact ? 6 : 10,
              child: Container(
                width: isCompact ? 22 : 28,
                height: isCompact ? 22 : 28,
                decoration: BoxDecoration(
                  color: const Color(0xFF202124).withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white10),
                ),
                child: Center(
                  child: Icon(
                    Icons.mic_off_rounded,
                    color: const Color(0xFF8AB4F8),
                    size: isCompact ? 12 : 14,
                  ),
                ),
              ),
            ),

          // 3. Bottom-left Participant Name
          Positioned(
            bottom: isCompact ? 6 : 10,
            left: isCompact ? 8 : 12,
            right: isCompact ? 8 : 12,
            child: Text(
              isSelf ? '$name (You)' : name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: Colors.white,
                fontSize: isCompact ? 10 : 12,
                fontWeight: FontWeight.w500,
                shadows: const [
                  Shadow(
                    color: Colors.black87,
                    offset: Offset(0, 1),
                    blurRadius: 4,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
