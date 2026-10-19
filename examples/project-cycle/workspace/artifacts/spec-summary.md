# Summary specification

The step SHALL consume exactly the accepted revision 2 object {"values":[1,2,3]} without mutation and write {"sum":6}. WHEN this object is supplied, THEN the three integers are added in source order beginning at zero. Missing or changed input SHALL stop without output. All revision 1 and revision 2 preparation artifacts remain unchanged.
