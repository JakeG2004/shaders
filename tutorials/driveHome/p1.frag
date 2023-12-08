#define S(a, b, t) smoothstep(a, b, t)

struct ray{
    vec3 origin, direction;
};

ray getRay(vec2 uv, vec3 camPos, vec3 lookAt, float zoom){
    //Init ray
    ray ray;
    ray.origin = camPos;

    //Camera params
    vec3 forward = normalize(lookAt - camPos);
    vec3 right = cross(vec3(0., 1., 0.), forward);
    vec3 up = cross(forward, right);

    //Screen intersect
    vec3 center = ray.origin + forward * zoom;
    vec3 intersect = center + uv.x * right + uv.y * up;

    //Normalize ray
    ray.direction = normalize(intersect - ray.origin);

    return ray;
}

vec3 closestPoint(ray ray, vec3 point){
    return(ray.origin + max(0., dot(point - ray.origin, ray.direction)) * ray.direction);
}

float distRay(ray ray, vec3 point){
    return length(point - closestPoint(ray, point));
}

float bokeh(ray ray, vec3 point, float size, float blur){

    //Calculate bokeh
    float dist = distRay(ray, point);
    float col = S(size, size * (1. - blur), dist);

    //add edge highlight
    col *= mix(.6, 1., S(size * .8, size, dist));
    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    //UV setup
    vec2 uv = fragCoord.xy / iResolution.xy; //Get uv
    uv -= .5; //Center uv
    uv.x *= iResolution.x / iResolution.y; //Set aspect ratio to square

    //Camera
    vec3 camPos = vec3(0., 0.2, 0.5);
    vec3 lookAt = vec3(0, 0.2, 1.);
    
    //make ray
    ray ray = getRay(uv, camPos, lookAt, 2.);

    vec3 point = vec3(0., 0., 5.);

    float bokehMask = bokeh(ray, point, .3, .1);
    vec3 col = vec3(1., .7, .3) * bokehMask;

    fragColor = vec4(vec3(col), 1.);
}