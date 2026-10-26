import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:livekit_client/livekit_client.dart';
import 'package:permission_handler/permission_handler.dart';

const defaultWebAppUrl = 'https://duetxmeet.vercel.app';

void main() => runApp(const DuetApp());

class DuetApp extends StatelessWidget {
  const DuetApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Duet Meet',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1A73E8)),
        useMaterial3: true,
      ),
      home: const JoinPage(),
    );
  }
}

class JoinPage extends StatefulWidget {
  const JoinPage({super.key});
  @override
  State<JoinPage> createState() => _JoinPageState();
}

class _JoinPageState extends State<JoinPage> {
  final _code = TextEditingController();
  final _name = TextEditingController(text: 'Guest');
  final _webApp = TextEditingController(text: defaultWebAppUrl);
  bool _loading = false;
  String? _error;

  Future<void> _join() async {
    setState(() { _loading = true; _error = null; });
    try {
      final base = _webApp.text.trim().replaceAll(RegExp(r'/+$'), '');
      final res = await http.post(
        Uri.parse(base + '/api/token'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'code': _code.text.trim(), 'name': _name.text.trim()}),
      );
      if (res.statusCode != 200) throw Exception('Join failed: ' + res.body);
      final data = jsonDecode(res.body);
      if (!mounted) return;
      Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => MeetingPage(
          url: data['url'] as String,
          token: data['token'] as String,
          name: _name.text.trim(),
          isHost: data['isHost'] == true,
        ),
      ));
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Duet Meet')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Join a meeting', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextField(controller: _code, decoration: const InputDecoration(labelText: 'Meeting code', border: OutlineInputBorder())),
            const SizedBox(height: 12),
            TextField(controller: _name, decoration: const InputDecoration(labelText: 'Your name', border: OutlineInputBorder())),
            const SizedBox(height: 12),
            TextField(controller: _webApp, decoration: const InputDecoration(labelText: 'Web app URL', border: OutlineInputBorder())),
            const SizedBox(height: 8),
            const Text('Use your deployed Duet URL or http://10.0.2.2:3000 for emulator', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 16),
            if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
            ElevatedButton(
              onPressed: _loading ? null : _join,
              child: Text(_loading ? 'Joining...' : 'Join meeting'),
            ),
          ],
        ),
      ),
    );
  }
}

class MeetingPage extends StatefulWidget {
  final String url;
  final String token;
  final String name;
  final bool isHost;
  const MeetingPage({super.key, required this.url, required this.token, required this.name, required this.isHost});
  @override
  State<MeetingPage> createState() => _MeetingPageState();
}

class _MeetingPageState extends State<MeetingPage> {
  Room? _room;
  bool _micOn = false;
  bool _camOn = false;
  bool _sharing = false;
  String _status = 'Connecting...';
  static const _screenChannel = MethodChannel('screen_capture');

  @override
  void initState() {
    super.initState();
    _connect();
  }

  Future<void> _connect() async {
    final room = Room();
    _room = room;
    room.addListener(_onRoomChanged);
    try {
      await [Permission.microphone, Permission.camera].request();
      await room.connect(widget.url, widget.token);
      await room.localParticipant?.setMicrophoneEnabled(true);
      await room.localParticipant?.setCameraEnabled(false);
      setState(() { _status = 'Connected'; _micOn = true; });
    } catch (e) {
      setState(() { _status = 'Failed: $e'; });
    }
  }

  void _onRoomChanged() {
    if (mounted) setState(() {});
  }

  Future<void> _toggleMic() async {
    final p = _room?.localParticipant;
    if (p == null) return;
    await p.setMicrophoneEnabled(!_micOn);
    setState(() { _micOn = !_micOn; });
  }

  Future<void> _toggleCam() async {
    final p = _room?.localParticipant;
    if (p == null) return;
    await p.setCameraEnabled(!_camOn);
    setState(() { _camOn = !_camOn; });
  }

  Future<void> _toggleShare() async {
    final p = _room?.localParticipant;
    if (p == null) return;
    try {
      if (!_sharing) await _screenChannel.invokeMethod('start');
      await p.setScreenShareEnabled(!_sharing);
      setState(() { _sharing = !_sharing; });
      if (_sharing) await _screenChannel.invokeMethod('stop');
    } catch (e) {
      try { await _screenChannel.invokeMethod('stop'); } catch (_) {}
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Share failed: $e')));
    }
  }

  @override
  void dispose() {
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

  @override
  Widget build(BuildContext context) {
    final tracks = _remoteVideoTracks();
    return Scaffold(
      appBar: AppBar(title: Text('Duet — ${widget.name}', overflow: TextOverflow.ellipsis)),
      body: Column(
        children: [
          Padding(padding: const EdgeInsets.all(8), child: Text(_status, style: const TextStyle(fontSize: 12))),
          Expanded(
            child: tracks.isEmpty
                ? const Center(child: Text('No remote video yet'))
                : GridView.count(
                    crossAxisCount: tracks.length == 1 ? 1 : 2,
                    children: tracks.map((t) => Padding(
                      padding: const EdgeInsets.all(4),
                      child: VideoTrackRenderer(t),
                    )).toList(),
                  ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.black87,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                IconButton(onPressed: _toggleMic, icon: Icon(_micOn ? Icons.mic : Icons.mic_off), color: Colors.white),
                IconButton(onPressed: _toggleCam, icon: Icon(_camOn ? Icons.videocam : Icons.videocam_off), color: Colors.white),
                IconButton(onPressed: _toggleShare, icon: Icon(_sharing ? Icons.stop_screen_share : Icons.screen_share), color: _sharing ? Colors.green : Colors.white),
                IconButton(onPressed: () { _room?.disconnect(); Navigator.of(context).pop(); }, icon: const Icon(Icons.call_end), color: Colors.red),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
