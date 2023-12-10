float distLine(vec3 ro, vec3 rd, vec3 p){
    return length(cross(p - ro, rd)) / length(rd);
}

float drawPoint(vec3 ro, vec3 rd, vec3 p){
    float d = distLine(ro ,rd, p);
    d = smoothstep(.06 ,.05, d);
    return d;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= .5;
    uv.x *= iResolution.x / iResolution.y;

    vec3 lookat = vec3(0.5, 0.5, 0.5);
    vec3 ro = vec3(sin(iTime), .5, cos(iTime)) + vec3(.5);
    
    //Determine camera vectors
    float zoom = 0.2;

    vec3 f = normalize(lookat - ro);
    vec3 r = normalize(cross(vec3(0., 1., 0.), f));
    vec3 u = cross(f, r);
    vec3 c = ro + f * zoom;

    //calc intersect to screen
    vec3 i = c + uv.x * r + uv.y * u;

    vec3 rd = i - ro;

    float d = 0.;

    //Cube vertices
    d += drawPoint(ro, rd, vec3(0., 0., 0.));
    d += drawPoint(ro, rd, vec3(1., 0., 0.));
    d += drawPoint(ro, rd, vec3(0., 1., 0.));
    d += drawPoint(ro, rd, vec3(1., 1., 0.));
    d += drawPoint(ro, rd, vec3(0., 0., 1.));
    d += drawPoint(ro, rd, vec3(1., 0., 1.));
    d += drawPoint(ro, rd, vec3(0., 1., 1.));
    d += drawPoint(ro, rd, vec3(1., 1., 1.));

    fragColor = vec4(vec3(d), 1.);
}