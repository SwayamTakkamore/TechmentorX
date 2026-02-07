import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _user;
  bool _isLoading = false;
  bool _isAuthenticated = false;

  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;

  Future<bool> checkAuth() async {
    try {
      final token = await ApiService.getToken();
      if (token == null) return false;

      final res = await ApiService.get('/auth/me');
      _user = res['user'];
      _isAuthenticated = true;
      notifyListeners();
      return true;
    } catch (e) {
      _isAuthenticated = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.post('/auth/login', {
        'email': email,
        'password': password,
      });

      await ApiService.setToken(res['accessToken']);
      _user = res['user'];
      _isAuthenticated = true;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signup(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.post('/auth/signup', {
        'name': name,
        'email': email,
        'password': password,
        'role': 'student',
      });

      await ApiService.setToken(res['accessToken']);
      _user = res['user'];
      _isAuthenticated = true;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try {
      await ApiService.post('/auth/logout', {});
    } catch (_) {}
    await ApiService.clearToken();
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}
