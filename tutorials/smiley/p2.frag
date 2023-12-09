#define S(a, b, t) smoothstep(a, b, t)
#define sat(x) clamp (x, 0., 1.)

float remap01(float a, float b, float t){
    return sat((t-a) / (b-a));
}

float remap(float a, float b, float c, float d, float t){
    return sat(((t - a) / (b-a)) * (d-c) + c);
}

vec2 within(vec2 uv, vec4 rect){
    return (uv - rect.xy) / (rect.zw - rect.xy);
}

vec4 eye(vec2 uv, float side, vec2 m){
    //Reset UV
    uv -= .5;
    float d = length(uv);
    uv.x *= side;

    //Get base colors
    vec4 irisCol = vec4(.1, .6, .9, 1.);
    vec4 col = mix(vec4(1.), irisCol, S(.1, .7, d) * .5);

    //Set eye shading
    col.rgb *= (1. - S(.45, .5 ,d) * .5 * sat(-uv.y - uv.x * side));

    d = length(uv - m * .5);

    //Iris outline
    col.rgb = mix(col.rgb, vec3(0.), S(.3, .28, d));

    //add gradient to iris
    irisCol.rgb *= 1. + S(.3, .05, d);

    //Mix in iris color
    col.rgb = mix(col.rgb, irisCol.rgb, S(.28, .25, d));

    //Mix in pupils
    col.rgb = mix(col.rgb, vec3(0.), S(.16, .14, d));

    //Set limits on iris color
    col.a = S(.5, .48, d);

    //eye highlights
    float highlight = S(.1, .08, length(uv - vec2(-.15, .15)));
    highlight += S(.07, .05, length(uv + vec2(-.08, .08)));
    col.rgb = mix(col.rgb, vec3(1.), highlight);
    return col;
}

vec4 mouth(vec2 uv){
    uv -= .5;
    vec4 col = vec4(0.2, 0., 0.05, 1.);

    //Make mouth
    uv.y *= 1.5;
    uv.y -= uv.x * uv.x * 2.; 
    float d = length(uv);
    col.a = S(.5, .48, d);

    //Teeth
    vec3 toothCol = vec3(1.) * S(.6, .35, d);
    float td = length(uv - vec2(0., .6));
    col.rgb = mix(col.rgb, toothCol, S(.4, .37, td));

    //Tongue
    td = length(uv + vec2(0. ,.5));
    col.rgb = mix(col.rgb, vec3(1., .5, .5), S(.3, .25, td));

    return col;
}

vec4 head(vec2 uv){
    //Create initial color
    vec4 col = vec4(.9, .65, .1, 1.);
    
    //Make circle
    float d = length(uv);
    col.a = S(.5, .49, d);

    //Gradient to darker on edges
    float edgeShadow = remap01(.35, .5, d);
    edgeShadow *= edgeShadow;

    //Better attenuation
    col.rgb *= 1. - edgeShadow * .5;

    //Mix it in
    col.rgb = mix(col.rgb, vec3(.6, .3, .1), S(.47, .48, d));

    //Create highlight
    float highlight = S(.41, .405, d);
    //Highlight on top; not on bottom
    highlight *= remap(.41, -.1, .75, .0, uv.y);
    //Eye sockets
    highlight *= S(.18, .19, length(uv - vec2(.21, .075)));
    //Mix in
    col.rgb = mix(col.rgb, vec3(1.), highlight);

    //Change d to be for the cheeks
    d = length(uv - vec2(.25, -.2));
    //Create cheeks
    float cheek = S(.2, .01, d) * .4;
    //Better attenuation
    cheek *= S(.17, .16, d);
    //Mix in
    col.rgb = mix(col.rgb, vec3(1., .1, .1), cheek);

    return col;
}

vec4 smiley(vec2 uv, vec2 m){
    vec4 col = vec4(0.);

    float side = sign(uv.x);
    uv.x = abs(uv.x);
    vec4 eye = eye(within(uv, vec4(.03, -.1, .37, .25)), side, m);
    vec4 head = head(uv);
    vec4 mouth = mouth(within(uv, vec4(-.3, -.4, .3, -.1)));

    col = mix(col, head, head.a);
    col = mix(col, eye, eye.a);
    col = mix(col, mouth, mouth.a);

    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= .5;
    uv.x *= iResolution.x / iResolution.y;

    vec2 m = iMouse.xy / iResolution.xy;
    m -= vec2(.5);

    fragColor = smiley(uv, m);
}