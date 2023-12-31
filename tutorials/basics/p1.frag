void mainImage(out vec4 fragColor, in vec2 fragCoord){
    //Nomralize pixel coordinates
    vec2 uv = fragCoord.xy / iResolution.xy; // 0 <> 1.
    //Center UV
    uv -= .5; // -0.5 <> 0.5
    //Set aspect ratio
    uv.x *= iResolution.x / iResolution.y;

    float d = length(uv);
    float r = 0.3;

    float c = smoothstep(r, r - 0.01, d);

    fragColor = vec4(vec3(c), 1.);

}