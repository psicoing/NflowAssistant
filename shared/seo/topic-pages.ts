import type { InternationalPage } from "./types";
import { buildTopicPages, type Guide } from "./topics/shared";
import wellbeing from "./topics/wellbeing";
import anxiety from "./topics/anxiety";
import sleepStress from "./topics/sleep-stress";
import workStress from "./topics/work-stress";
import grief from "./topics/grief";
import loneliness from "./topics/loneliness";
import selfEsteem from "./topics/self-esteem";
import relationshipBreakup from "./topics/relationship-breakup";
import boundaries from "./topics/boundaries";
import teenAnxiety from "./topics/teen-anxiety";
import emotionalExhaustion from "./topics/emotional-exhaustion";
import familyConflicts from "./topics/family-conflicts";

const guides: Guide[] = [wellbeing, anxiety, sleepStress, workStress, grief, loneliness, selfEsteem, relationshipBreakup, boundaries, teenAnxiety, emotionalExhaustion, familyConflicts];

export const topicPages: InternationalPage[] = guides.flatMap(buildTopicPages);
