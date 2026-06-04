package com.whisperboxBackend.util;

import org.springframework.stereotype.Component;

import java.util.Random;

/**
 * Generates random anonymous names for users
 * Format: Adjective + Animal (e.g., "Silent Panda", "Brave Tiger")
 */
@Component
public class AnonymousNameGenerator {

    private static final String[] ADJECTIVES = {
            "Silent", "Brave", "Curious", "Gentle", "Swift",
            "Wise", "Bold", "Calm", "Bright", "Happy",
            "Clever", "Kind", "Noble", "Quiet", "Serene",
            "Witty", "Eager", "Loyal", "Proud", "Honest"
    };

    private static final String[] ANIMALS = {
            "Panda", "Tiger", "Eagle", "Dolphin", "Fox",
            "Owl", "Bear", "Wolf", "Hawk", "Lion",
            "Deer", "Rabbit", "Falcon", "Koala", "Penguin",
            "Otter", "Lynx", "Crane", "Jaguar", "Whale"
    };

    private final Random random = new Random();

    /**
     * Generate a random anonymous name
     * @return Anonymous name in format "Adjective Animal"
     */
    public String generate() {
        String adjective = ADJECTIVES[random.nextInt(ADJECTIVES.length)];
        String animal = ANIMALS[random.nextInt(ANIMALS.length)];
        return adjective + " " + animal;
    }
}
