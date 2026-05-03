package com.zhihu.service;

import com.google.gson.JsonObject;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public interface NursingHomeService {
    JsonObject searchNearbyNursingHomes(String query, double lng, double lat, int radius) throws IOException;
}
