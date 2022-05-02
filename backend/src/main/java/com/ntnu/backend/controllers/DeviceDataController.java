package com.ntnu.backend.controllers;

import com.ntnu.backend.DAO.DeviceRepository;
import com.ntnu.backend.DAO._influx.DeviceDataRepository;
import com.ntnu.backend.models.entities.Device;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.ntnu.backend.models.responses.ErrorMessage;

import java.util.Optional;

@Api
@Controller
@RequestMapping("/api/device_data")
public class DeviceDataController {

    private static final int MAX_LOOKBACK_HOURS = 30*24;

    private final DeviceDataRepository deviceDataRepository;
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceDataController(DeviceDataRepository deviceDataRepository, DeviceRepository deviceRepository) {
        this.deviceDataRepository = deviceDataRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping("/get_raw/{deviceId}")
    public ResponseEntity<?> getRawData(@AuthenticationPrincipal Jwt jwt, @PathVariable long deviceId,
                                        @RequestParam(name = "lookback_start", defaultValue = "6") int lookbackStart,
                                        @RequestParam(name = "lookback_end", defaultValue = "0") int lookbackEnd){

        if(lookbackEnd >= lookbackStart)
            return ResponseEntity.badRequest().body(ErrorMessage.DEVICE_DATA_START_MUST_BE_BEFORE_END);
        if(lookbackStart > MAX_LOOKBACK_HOURS)
            return ResponseEntity.badRequest().body(ErrorMessage.DEVICE_DATA_LOOKBACK_TOO_LONG);

        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if(deviceOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorMessage.DEVICE_NOT_FOUND);
        }
        Device device = deviceOptional.get();
        if(device.getOrganizationId() !=  (long) jwt.getClaim("http://AQ/orgId")){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorMessage.DEVICE_NOT_IN_YOUR_ORGANIZATION);
        }

        return ResponseEntity.ok(deviceDataRepository.getRawDataForDevice(deviceId, lookbackStart, lookbackEnd));

    }

}