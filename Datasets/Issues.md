#### Issues
1. Closest CityCycle location?
    1. 2d point SQL search for the shortest straight line distance (return top 10)
    1. Google API calculates real top x results.
1. Closest & y mins from destination DEST
    1. =[straight line distance](http://www.cut-the-knot.org/pythagoras/DistanceFormula.shtml) from a [circle or semicircle](http://sites.csn.edu/istewart/Math126/circles/circles.htm)
      * upper half of a circle: y = (r^2-x^2)^(1/2)
      * lower half of a circle: y = -(r^2-x^2)^(1/2)
      * left half of a circle:  x = -(r^2-y^2)^(1/2)
      * right half of a circle: x = (r^2-y^2)^(1/2)
      * equation for straight line distance: SLD((a,b), (c,e)) = ((a-c)2 + (b-e)^2)^(1/2)
      * point DEST(c,e) is given by minimizing the SLD CiyCycleLocation(f,g) and the circle based on radius and points given from google API returned radius r, points(g,o) 
      * IE REAL STEP 1 is: radius r, the straight line distance between DEST and a point USERINPUT mins away in the direction of the destination must be calculated: 
      * GOOGLE SLD((c,e), (g,o)) = ((c-g)2 + (e-o)^2)^(1/2)
      REAL STEP 2: make a circle: CIRC l = (g-c)^2 + (o-e)^2 = r^2
      REAL STEP 3: refer back to CIRC l later...
      REAL STEP 4: for(i=1;i=m;i++); where m is the maximum entities in __database table for city cycle points!!??__
      CCL SLD((f,g), min(CCL)) = CCL SLD((f,g), derivative of CIRC
      REAL STEP 5: derivative of CIRC = ... (there's a [calculator](https://www.symbolab.com/solver/implicit-derivative-calculator) for that)
    1. compare processing times between shortlisting and going through all of the long/lat points on the Database
SOOOOOOO SLLLLLLLOOOOOOOWWWWWWWWW!!!!!!!!! (probably...)

1. CityCycleAPI functionality? we need to draw from the API to get the CityCycle long & lat for SQL shortlist procedures if we run the SQL shortlist option for USERINPUT -> GOOGLE SLD -> min(CC SLD) process.
