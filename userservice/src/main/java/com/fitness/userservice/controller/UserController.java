package com.fitness.userservice.controller;


import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/users")
    @AllArgsConstructor
    @Slf4j
    public class UserController {
        private UserService userService;

        @GetMapping("/{userId}")
        public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId) {
            return ResponseEntity.ok(userService.getUserProfile(userId));
        }

        @PostMapping("/register")
        public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
            return ResponseEntity.ok(userService.register(request));
        }

        @GetMapping("/{userId}/validate")
        public Boolean validate(@PathVariable String userId) {
            log.info("From User controller for {}", userId);
            return userService.existByUserId(userId);
        }
    }