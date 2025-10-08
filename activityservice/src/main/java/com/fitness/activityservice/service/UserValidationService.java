// activityservice
package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId) {
        if (userId == null || userId.isBlank()) {
            log.warn("validateUser called with null/blank userId");
            return false;
        }
        log.info("Calling User Service for {}", userId);
        try {
            Boolean ok = userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .onStatus(HttpStatusCode::is5xxServerError,
                            r -> Mono.error(new IllegalStateException("userservice returned 5xx")))
                    .bodyToMono(Boolean.class)
                    .timeout(Duration.ofSeconds(2))
                    .onErrorResume(ex -> {
                        log.error("User validation failed for {}: {}", userId, ex.toString());
                        return Mono.just(false);
                    })
                    .block();
            return Boolean.TRUE.equals(ok);
        } catch (Exception e) {
            log.error("User validation exception for {}: {}", userId, e.toString());
            return false;
        }
    }
}
