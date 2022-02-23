package com.ntnu.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BaseController {

    // Root-url GET endpoint is necessary to make AWS believe everything is ok
    @GetMapping("/")
    public ResponseEntity<?> greet(){
        return ResponseEntity.ok("Greetings from Eitaq Api Server!");
    }

}
