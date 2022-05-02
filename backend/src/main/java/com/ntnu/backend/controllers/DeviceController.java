package com.ntnu.backend.controllers;

import com.amazonaws.services.iot.AWSIot;
import com.ntnu.backend.DAO.DeviceRepository;
import com.ntnu.backend.DAO.RoomRepository;
import com.ntnu.backend.models.entities.Room;
import com.ntnu.backend.models.requests.devices.CreateDeviceRequest;
import com.ntnu.backend.models.responses.ErrorMessage;
import io.swagger.annotations.Api;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@Api
@Controller
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;
    private final RoomRepository roomRepository;
    private final AWSIot awsIoTClient;

    public DeviceController(DeviceRepository deviceRepository, RoomRepository roomRepository, AWSIot awsIoTClient) {
        this.deviceRepository = deviceRepository;
        this.roomRepository = roomRepository;
        this.awsIoTClient = awsIoTClient;
    }

    @GetMapping("/get_for_room/{roomId}")
    public ResponseEntity<?> getDevicesInRoom(@AuthenticationPrincipal Jwt jwt, @PathVariable long roomId){
        Optional<Room> roomOptional = roomRepository.findById(roomId);
        if(roomOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorMessage.ROOM_NOT_FOUND);
        }
        if(roomOptional.get().getOrganizationId() != (long) jwt.getClaim("http://AQ/orgId")){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorMessage.ROOM_NOT_IN_YOUR_ORGANIZATION);
        }

        return ResponseEntity.ok(deviceRepository.findAllByRoom(roomOptional.get()));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDevice(@AuthenticationPrincipal Jwt jwt,
                                          @Valid @RequestBody CreateDeviceRequest createDeviceRequest){
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

}