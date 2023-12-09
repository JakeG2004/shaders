float distLine(vec3 ro, vec3 rd, vec3 p){
    return length(cross(p - ro, rd)) / length(rd);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= .5;
    uv.x *= iResolution.x / iResolution.y;

    vec3 ro = vec3(0., 0., -2.);
    vec3 rd = vec3(uv.x, uv.y, 0.) - ro;

    vec3 p = vec3(sin(iTime) , sin(iTime), 2. + cos(iTime));

    float d = distLine(ro ,rd, p);
    d = smoothstep(.1 ,.09, d);

    fragColor = vec4(vec3(d), 1.);
}