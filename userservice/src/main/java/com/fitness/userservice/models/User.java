package com.fitness.userservice.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "keycloak_id", unique = true)   // map to DB column (snake_case if you want)
    private String keycloakId;                      // <-- lowercase k (matches repo method)

    @Column(unique = true, nullable = false)
    private String email;

    // Consider nullable for Keycloak-managed users, or store a random hashed placeholder
    @Column
    private String password;

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
