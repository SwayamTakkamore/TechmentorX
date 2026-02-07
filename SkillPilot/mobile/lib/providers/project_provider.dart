import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ProjectProvider extends ChangeNotifier {
  List<Map<String, dynamic>> _projects = [];
  Map<String, dynamic>? _activeProject;
  bool _isLoading = false;

  List<Map<String, dynamic>> get projects => _projects;
  Map<String, dynamic>? get activeProject => _activeProject;
  bool get isLoading => _isLoading;

  Future<void> loadProjects() async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.get('/projects');
      _projects = List<Map<String, dynamic>>.from(res['projects']);
    } catch (e) {
      debugPrint('Error loading projects: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadActiveProject() async {
    try {
      final res = await ApiService.get('/projects/active');
      _activeProject = res['project'];
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading active project: $e');
    }
  }

  Future<Map<String, dynamic>> getProjectById(String id) async {
    final res = await ApiService.get('/projects/$id');
    return res['project'];
  }

  Future<void> updateTaskStatus(
      String projectId, String taskId, String status) async {
    final res =
        await ApiService.patch('/tasks/$projectId/$taskId/status', {'status': status});
    final updatedProject = res['project'] as Map<String, dynamic>;

    final index = _projects.indexWhere((p) => p['_id'] == projectId);
    if (index != -1) {
      _projects[index] = updatedProject;
    }
    if (_activeProject?['_id'] == projectId) {
      _activeProject = updatedProject;
    }
    notifyListeners();
  }

  Future<String> sendChatMessage(String projectId, String message) async {
    final res = await ApiService.post('/chat/$projectId', {'message': message});
    return res['message'] as String;
  }

  Future<List<Map<String, dynamic>>> getChatMessages(String projectId) async {
    final res = await ApiService.get('/chat/$projectId');
    return List<Map<String, dynamic>>.from(res['messages'] ?? []);
  }
}
