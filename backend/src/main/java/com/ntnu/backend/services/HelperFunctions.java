package com.ntnu.backend.services;

import java.util.regex.Pattern;

public class HelperFunctions {

    public static boolean isEmail(String emailString){
        String regexPattern = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return Pattern.compile(regexPattern)
                .matcher(emailString)
                .matches();
    }

}
