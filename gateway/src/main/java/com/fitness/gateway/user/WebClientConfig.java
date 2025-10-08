package com.fitness.gateway.user;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder lbWebClientBuilder() {
        return WebClient.builder();
    }


    @Bean
    public WebClient userServiceWebClient(@Qualifier("lbWebClientBuilder") WebClient.Builder builder) {
        return builder
                .baseUrl("http://user-service")
                .build();
    }
}
