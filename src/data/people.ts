/**
 * The people on the site: the faces from Diyama's own service graphics.
 *
 * SOURCE. The designed posts Diyama's Facebook page is known for (the suit and
 * the golden ring, the woman in the blazer from the ZRA and NAPSA series, the two
 * men talking, the man at the desk, the staircase). Masters live in
 * `workforce/engine/art/library/diyama/` as `fa-<id>.jpg`; these are the people
 * cropped out of them, web-sized WebP.
 *
 * RULES. Ernest, 11 November 2026, after the workshop photographs went in: "noooo
 * not those ... i mean the old service graphics, the humans on them". So these,
 * and not event photographs. They are the brand's own designs, so the site may say
 * "from our own graphics". They are models, not staff or clients: never caption
 * one with a name, a job title at Diyama or a client's name.
 */
import suitMan from "@/assets/people/suit-man.webp";
import suitWoman from "@/assets/people/suit-woman.webp";
import staircase from "@/assets/people/staircase.webp";
import cameraMan from "@/assets/people/camera-man.webp";
import womanBlack from "@/assets/people/woman-black.webp";
import womanYellow from "@/assets/people/woman-yellow.webp";
import twoMen from "@/assets/people/two-men.webp";
import deskMan from "@/assets/people/desk-man.webp";
import smilingMan from "@/assets/people/smiling-man.webp";
import zraWoman from "@/assets/people/zra-woman.webp";
import conferenceWoman from "@/assets/people/conference-woman.webp";
import socialWoman from "@/assets/people/social-woman.webp";

export interface PeoplePhoto {
  src: string;
  alt: string;
}

export const peopleCaption = "From Diyama's own service graphics, the designs our page is known for.";

/* Order matters: the homepage shows the first five, the scroll story picks by index. */
export const peoplePhotos: PeoplePhoto[] = [
  { src: deskMan, alt: "A man in a suit thinking at a desk, from a Diyama service graphic" },
  { src: suitWoman, alt: "A smiling woman in a blazer, from a Diyama service graphic" },
  { src: suitMan, alt: "A man in a blue suit inside a golden ring, from a Diyama service graphic" },
  { src: womanYellow, alt: "A woman in a yellow jumper with her arms folded, from a Diyama service graphic" },
  { src: twoMen, alt: "Two men in suits talking in an office, from a Diyama service graphic" },
  { src: staircase, alt: "Business people helping each other up a golden staircase, from a Diyama service graphic" },
  { src: womanBlack, alt: "A woman in black with braids, from a Diyama service graphic" },
  { src: cameraMan, alt: "A man in a suit holding a camera, from a Diyama service graphic" },
  { src: zraWoman, alt: "A woman in a black suit, from the Diyama statutory obligations series" },
  { src: conferenceWoman, alt: "A woman in a red top and head wrap, from a Diyama conference graphic" },
  { src: socialWoman, alt: "A woman looking at the camera, from a Diyama social media graphic" },
  { src: smilingMan, alt: "A smiling man in a shirt, from a Diyama graphic" },
];

/* The hero backdrop and the three scroll story frames. */
export const heroPerson = deskMan;
export const storyPeople = [twoMen, deskMan, suitMan];
