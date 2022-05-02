package com.ntnu.backend.models.requests.FCM;

import java.util.Collection;
import java.util.Map;

public class PushMessageRequest {

    private final Collection<String> tokensToSendTo;
    private final Map<String, String> data;

    public PushMessageRequest(Collection<String> tokensToSendTo, Map<String, String> data) {
        this.tokensToSendTo = tokensToSendTo;
        this.data = data;
    }

    public Collection<String> getTokensToSendTo() {
        return tokensToSendTo;
    }

    public Map<String, String> getData() {
        return data;
    }
}
