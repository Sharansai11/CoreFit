package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;


    @Transactional
    public ActivityResponse trackActivity(ActivityRequest request) {

        // 1) Guard against null/blank userId (prevents //validate)
        if (request == null || request.getUserId() == null || request.getUserId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        // 2) Validate user via userservice (load-balanced WebClient)
        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if (!isValidUser) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid userId: " + request.getUserId());
        }

        // 3) Persist activity
        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);
        log.info("Tracked activity {} for user {}", savedActivity.getId(), savedActivity.getUserId());
        try {
            kafkaTemplate.send(topicName, savedActivity.getUserId(), savedActivity);
        } catch (Exception e) {
            log.info(String.valueOf(e));
        }

        return mapToResponse(savedActivity);
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }


        return activityRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ActivityResponse mapToResponse(Activity a) {
        ActivityResponse r = new ActivityResponse();
        r.setId(a.getId());
        r.setUserId(a.getUserId());
        r.setType(a.getType());
        r.setDuration(a.getDuration());
        r.setCaloriesBurned(a.getCaloriesBurned());
        r.setStartTime(a.getStartTime());
        r.setAdditionalMetrics(a.getAdditionalMetrics());
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        return r;
    }
}
