float circle(vec2 uv, vec2 p, float r, float blur){

    float d = length(uv - p); //Set distance and pos
    return(smoothstep(r, r - blur, d));
}

float smiley(vec2 uv, vec2 p, float size){

    uv -= p; //Translate coordinate system
    uv /= size; //Scale coordinate system

    //Make face
    float c = circle(uv, vec2(0., 0.), 0.4, 0.01); //Make initial circle
    c -= circle(uv, vec2(.2, 0.15), 0.1, 0.01); //subtract eye
    c -= circle(uv, vec2(-.2, 0.15), 0.1, 0.01); //subtract second eye

    //Make mouth
    float mouth = circle(uv, vec2(0., 0.), 0.3, 0.01);
    mouth -= circle(uv, vec2(0., 0.05), 0.3, 0.01);
    //Get rid of top artifact of mouth
    mouth = clamp(mouth, 0., 1.);

    //Subtract the mouth
    c -= mouth;

    return c;
}

float band(float t, float start, float end, float blur){
    float step1 = smoothstep(start - blur, start + blur, t);
    float step2 = smoothstep(end + blur, end - blur, t);
    return step1 * step2;
}

float rect(vec2 uv, float left, float right, float bottom, float top, float blur){
    float band1 = band(uv.x, left, right, blur);
    float band2 = band(uv.y, bottom, top, blur);

    return band1 * band2;
}

float remap01(float a, float b, float t){
    return (t-a) / (b-a);
}

float remap(float a, float b, float c, float d, float t){
    return remap01(a, b, t) * (d-c) + c;

}

void mainImage(out vec4 fragColor, in vec2 fragCoord){

    //Nomralize pixel coordinates
    vec2 uv = fragCoord.xy / iResolution.xy; // 0 <> 1.
    //Center UV
    uv -= .5; // -0.5 <> 0.5
    //Set aspect ratio
    uv.x *= iResolution.x / iResolution.y;

    vec3 col = vec3(.75, 1., 1.);

    float mask = 0.;

    float x = uv.x;
    float m = sin(x*8. + iTime) * .1;
    float y = uv.y - m;

    float blur = remap(-.5, .5, 0.01, .25, x);
    blur = pow(blur * 4., 10.);

    mask = rect(vec2(x, y), -.5, .5, -.1, .1, blur);
    col *= mask;

    fragColor = vec4(col, 1.);

}