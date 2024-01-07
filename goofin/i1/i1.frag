vec4 circle(vec2 uv, vec2 pos, float r){
    float d = length(uv - pos);

    float c = smoothstep(r, r - 0.01, d);

    return vec4(vec3(c), 1.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    //Nomralize pixel coordinates
    vec2 uv = fragCoord.xy / iResolution.xy; // 0 <> 1.
    //Center UV
    uv -= .5; // -0.5 <> 0.5
    //Set aspect ratio
    uv.x *= iResolution.x / iResolution.y;

    vec3 c = abs(vec3(sin(iTime + 1.), sin(iTime + 3.), sin(iTime - 1.)));

    fragColor += circle(uv, vec2(cos(iTime) / 2.5, sin(iTime) / 2.5), .1);
    fragColor *= vec4(c, 1.);

}