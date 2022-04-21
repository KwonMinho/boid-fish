import AlignmentBehavior from "./alignment_behavior";
import CohesionBehavior from "./cohesion_behavior";
import SeparationBehavior from "./separation_behavior";


export default interface BoidBehaviors extends 
    AlignmentBehavior, 
    CohesionBehavior,
    SeparationBehavior 
    {}