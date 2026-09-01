package com.spendwise.auth.controller;

import com.spendwise.auth.dto.*;
import com.spendwise.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal Object principal) {
        if (principal instanceof com.spendwise.auth.entity.User user) {
            return ResponseEntity.ok(authService.mapToUserDto(user));
        } else if (principal instanceof UserDetails userDetails) {
            return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        Long userId = resolveUserId(headerUserId, principal);
        authService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @AuthenticationPrincipal Object principal,
            @RequestBody UpdateProfileRequest request
    ) {
        Long userId = resolveUserId(headerUserId, principal);
        UserDto updated = authService.updateProfile(userId, request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam("token") String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    private Long resolveUserId(Long headerUserId, Object principal) {
        if (headerUserId != null) {
            return headerUserId;
        }
        if (principal instanceof com.spendwise.auth.entity.User user) {
            return user.getId();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required");
    }
}
