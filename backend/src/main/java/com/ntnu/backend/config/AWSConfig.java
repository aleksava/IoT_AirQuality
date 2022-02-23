package com.ntnu.backend.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.iot.AWSIot;
import com.amazonaws.services.iot.AWSIotClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AWSConfig {

    final BasicAWSCredentials basicAWSCredentials;

    public AWSConfig(@Value("${aws.accessKeyId}") String accessKeyId, @Value("${aws.secretKey}") String secretKey) {
        this.basicAWSCredentials = new BasicAWSCredentials(accessKeyId, secretKey);
    }

    @Bean(name = "AWSIoTClient")
    public AWSIot getAWSIoTClient(){
        return AWSIotClient.builder()
                .withRegion(Regions.EU_CENTRAL_1)
                .withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials))
                .build();
    }

}
