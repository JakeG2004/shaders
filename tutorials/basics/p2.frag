float circle(vec2 uv, vec2 p, float r, float blur){

    float d = length(uv - p); //Set distance and pos
    return(smoothstep(r, r - blur, d));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    //Nomralize pixel coordinates
    vec2 uv = fragCoord.xy / iResolution.xy; // 0 <> 1.
    //Center UV
    uv -= .5; // -0.5 <> 0.5
    //Set aspect ratio
    uv.x *= iResolution.x / iResolution.y;

    vec3 col = vec3(1., 1., 0.);

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

    col *= c; //Set shader color

    fragColor = vec4(col, 1.);

}