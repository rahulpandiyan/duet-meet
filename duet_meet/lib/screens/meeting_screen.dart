import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:livekit_client/livekit_client.dart';
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

class _MeetingPageState extends State<MeetingPage> {
  Room? _room;
  late bool _micOn;
  late bool _camOn;
  bool _sharing = false;
  String _currentTime = '';
  Timer? _clockTimer;

  @override
  void initState() {
    super.initState();
    _micOn = widget.initialMicOn;
    _camOn = widget.initialCamOn;
    _updateTime();
    _clockTimer = Timer.periodic(const Duration(seconds: 30), (_) => _updateTime());
    _connect();
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
    try {
      final next = !_sharing;
      await p.setScreenShareEnabled(next);
      setState(() => _sharing = next);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Screen share failed: $e'),
          backgroundColor: DuetColors.danger,
        ),
      );
    }
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    _room?.removeListener(_onRoomChanged);
    _room?.disconnect();
    super.dispose();
  }

  List<VideoTrack> _remoteVideoTracks() {
    final room = _room;
    if (room == null) return [];
    final tracks = <VideoTrack>[];
    for (final p in room.remoteParticipants.values) {
      for (final pub in p.trackPublications.values) {
        final t = pub.track;
        if (t is RemoteVideoTrack) tracks.add(t);
      }
    }
    return tracks;
  }

  void _leaveCallDirectly() {
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
    final screenTracks = _remoteVideoTracks();
    final remoteParticipants = _room?.remoteParticipants.values.toList() ?? [];
    final participantCount = remoteParticipants.length + 1;

    return Scaffold(
      backgroundColor: const Color(0xFF202124),
      body: SafeArea(
        child: Column(
          children: [
            // Google Meet Top Bar: Time | code (i) on left, Avatar + count on right
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
                              errorBuilder: (context, error, stackTrace) => const Icon(Icons.person, size: 12, color: Colors.white),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '$participantCount',
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

            // Video Canvas: Screen share or Google Meet participant tiles
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                child: screenTracks.isNotEmpty
                    ? _buildScreenShareGrid(screenTracks)
                    : _buildParticipantTile(
                        widget.name,
                        isSelf: true,
                        isMicOn: _micOn,
                        isCamOn: _camOn,
                      ),
              ),
            ),

            // Google Meet Bottom Controls Dock
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
                          icon: _sharing ? Icons.stop_screen_share_rounded : Icons.screen_share_rounded,
                          isActive: true,
                          isAccent: _sharing,
                          onPressed: _toggleShare,
                          tooltip: _sharing ? 'Stop sharing' : 'Share screen',
                        ),
                        const SizedBox(width: 14),

                        // Google Meet Red Pill End Call Button
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

  /// Google Meet Video/Avatar Tile
  Widget _buildParticipantTile(
    String name, {
    required bool isSelf,
    required bool isMicOn,
    required bool isCamOn,
  }) {
    final critterUrl =
        'https://api.dicebear.com/10.x/critters/png?seed=${Uri.encodeComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=256';

    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF3C4043), // Google Meet slate tile surface
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF5F6368).withValues(alpha: 0.3)),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            offset: Offset(0, 8),
            blurRadius: 20,
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Centered Critters Avatar inside Circle
          Center(
            child: Container(
              width: 110,
              height: 110,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF28292A),
                border: Border.all(color: Colors.white12, width: 2),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black38,
                    offset: Offset(0, 6),
                    blurRadius: 16,
                  ),
                ],
              ),
              child: ClipOval(
                child: Image.network(
                  critterUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Center(
                    child: Icon(Icons.person_rounded, size: 48, color: Colors.white70),
                  ),
                ),
              ),
            ),
          ),

          // Top-right Muted Mic Indicator Badge
          if (!isMicOn)
            Positioned(
              top: 14,
              right: 14,
              child: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFF202124).withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white10),
                ),
                child: const Center(
                  child: Icon(
                    Icons.mic_off_rounded,
                    color: Color(0xFF8AB4F8),
                    size: 16,
                  ),
                ),
              ),
            ),

          // Bottom-left Participant Name
          Positioned(
            bottom: 14,
            left: 16,
            child: Text(
              isSelf ? '$name (You)' : name,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w500,
                letterSpacing: 0.2,
                shadows: [
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

  Widget _buildScreenShareGrid(List<VideoTrack> tracks) {
    return GridView.builder(
      itemCount: tracks.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: tracks.length == 1 ? 1 : 2,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: tracks.length == 1 ? 16 / 9 : 1.0,
      ),
      itemBuilder: (ctx, i) {
        final t = tracks[i];
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
                VideoTrackRenderer(t),
                Positioned(
                  bottom: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF202124).withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: Color(0xFF8AB4F8),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Screen ${i + 1}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
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
      },
    );
  }
}
