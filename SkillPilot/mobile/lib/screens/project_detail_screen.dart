import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/project_provider.dart';
import 'chat_screen.dart';

class ProjectDetailScreen extends StatefulWidget {
  final String projectId;
  const ProjectDetailScreen({super.key, required this.projectId});

  @override
  State<ProjectDetailScreen> createState() => _ProjectDetailScreenState();
}

class _ProjectDetailScreenState extends State<ProjectDetailScreen> {
  Map<String, dynamic>? _project;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadProject();
  }

  Future<void> _loadProject() async {
    try {
      final project = await context.read<ProjectProvider>().getProjectById(widget.projectId);
      setState(() {
        _project = project;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  Future<void> _updateTaskStatus(String taskId, String newStatus) async {
    try {
      await context.read<ProjectProvider>().updateTaskStatus(widget.projectId, taskId, newStatus);
      await _loadProject();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_project == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Project not found')),
      );
    }

    final tasks = List<Map<String, dynamic>>.from(_project!['tasks'] ?? []);
    final todoTasks = tasks.where((t) => t['status'] == 'todo').toList();
    final inProgressTasks = tasks.where((t) => t['status'] == 'in-progress').toList();
    final doneTasks = tasks.where((t) => t['status'] == 'done').toList();
    final progress = (_project!['progress'] as num?)?.toDouble() ?? 0;
    final techStack = List<String>.from(_project!['techStack'] ?? []);

    return Scaffold(
      appBar: AppBar(
        title: Text(_project!['title'] ?? '', style: const TextStyle(fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.chat_outlined),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ChatScreen(
                  projectId: widget.projectId,
                  projectTitle: _project!['title'] ?? '',
                ),
              ),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadProject,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Description
            Text(
              _project!['description'] ?? '',
              style: TextStyle(color: Colors.grey[600], height: 1.5),
            ),
            const SizedBox(height: 12),

            // Tech Stack
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: techStack.map((t) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F4FF),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(t, style: const TextStyle(fontSize: 12, color: Color(0xFF4263EB), fontWeight: FontWeight.w500)),
              )).toList(),
            ),
            const SizedBox(height: 20),

            // Progress
            Row(
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: progress / 100,
                      backgroundColor: Colors.grey[100],
                      color: const Color(0xFF4C6EF5),
                      minHeight: 8,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Text('${progress.round()}%', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 24),

            // Task Columns
            _TaskColumn(title: 'To Do', tasks: todoTasks, color: Colors.grey[100]!, onStatusChange: _updateTaskStatus),
            const SizedBox(height: 16),
            _TaskColumn(title: 'In Progress', tasks: inProgressTasks, color: Colors.blue[50]!, onStatusChange: _updateTaskStatus),
            const SizedBox(height: 16),
            _TaskColumn(title: 'Done', tasks: doneTasks, color: Colors.green[50]!, onStatusChange: _updateTaskStatus),
          ],
        ),
      ),
    );
  }
}

class _TaskColumn extends StatelessWidget {
  final String title;
  final List<Map<String, dynamic>> tasks;
  final Color color;
  final Future<void> Function(String taskId, String newStatus) onStatusChange;

  const _TaskColumn({
    required this.title,
    required this.tasks,
    required this.color,
    required this.onStatusChange,
  });

  @override
  Widget build(BuildContext context) {
    final statusOptions = {
      'To Do': ['in-progress', 'done'],
      'In Progress': ['todo', 'done'],
      'Done': ['todo', 'in-progress'],
    };

    final statusLabels = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done',
    };

    return Container(
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
            child: Row(
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text('${tasks.length}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ),
          if (tasks.isEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
              child: Text('No tasks', style: TextStyle(color: Colors.grey[400], fontSize: 13)),
            ),
          ...tasks.map((task) => Padding(
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 8),
                child: Card(
                  elevation: 0,
                  margin: EdgeInsets.zero,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    side: BorderSide(color: Colors.grey[200]!),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(task['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14)),
                        const SizedBox(height: 4),
                        Text(
                          task['description'] ?? '',
                          style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          children: (statusOptions[title] ?? []).map<Widget>((status) => InkWell(
                                onTap: () => onStatusChange(task['_id'], status),
                                borderRadius: BorderRadius.circular(6),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[100],
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    '→ ${statusLabels[status]}',
                                    style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                                  ),
                                ),
                              )).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              )),
          if (tasks.isNotEmpty) const SizedBox(height: 6),
        ],
      ),
    );
  }
}
