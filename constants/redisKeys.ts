export const redisKeys = {
    ACTIVATION_KEY_PREFIX: 'user:activation:',
    ACTIVATION_KEY_TTL_DAYS: 2,

    OTP_KEY_PREFIX:'user:otp:',
    OTP_TTL_MINUTES: 10,

    PASS_RESET_KEY_PREFIX: 'user:password-reset:',
    PASS_RESET_KEY_MINUTES: 10,

    REFRESH_TOKEN_KEY_PREFIX: 'user:refresh-token:',
    REFRESH_TOKEN_KEY_TTL_MINUTES: 15,

    SESSION_KEY_PREFIX:'user:session:',
    SESSION_TTL_MINUTES: 15,
}
