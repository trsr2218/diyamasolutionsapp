/**
 * The only people on the site: real photographs from Diyama's own events.
 *
 * SOURCE. Diyama's Global Pizza Party workshop, Livingstone, 24 May 2026, the
 * frames Diyama published on its own Facebook page. Master copies live in
 * `workforce/engine/art/library/diyama/` (the `fa-96017...` files). These are the
 * web-sized WebP copies.
 *
 * RULES. Ernest, 11 November 2026: real humans on the site, the ones from the
 * Facebook posts. Nobody is named and nobody is captioned as staff or as a
 * client, because the frames do not record who each person is. The caption
 * names the event only. No generated or stock people, ever.
 */
import speaker from "@/assets/people/workshop-speaker.webp";
import room from "@/assets/people/workshop-room.webp";
import talk from "@/assets/people/workshop-talk.webp";
import falls from "@/assets/people/falls-posters.webp";
import lunch from "@/assets/people/workshop-lunch.webp";
import table from "@/assets/people/workshop-table.webp";
import laptop from "@/assets/people/workshop-laptop.webp";
import phone from "@/assets/people/workshop-phone.webp";
import group from "@/assets/people/falls-group.webp";

export interface PeoplePhoto {
  src: string;
  alt: string;
}

export const peopleCaption = "Diyama's Global Pizza Party workshop, Livingstone, May 2026.";

export const peoplePhotos: PeoplePhoto[] = [
  { src: speaker, alt: "A speaker with a microphone presenting at the Diyama workshop in Livingstone" },
  { src: room, alt: "Guests at laptops under string lights at the Diyama workshop" },
  { src: talk, alt: "Guests talking across the table at the Diyama workshop" },
  { src: falls, alt: "Workshop guests holding Global Pizza Day posters at the Victoria Falls" },
  { src: lunch, alt: "Guests sharing pizza at the Diyama workshop" },
  { src: table, alt: "Guests seated at the long table at the Diyama workshop" },
  { src: laptop, alt: "A guest working on a laptop at the Diyama workshop" },
  { src: phone, alt: "A guest checking a phone at the Diyama workshop table" },
  { src: group, alt: "The workshop group at the Victoria Falls in the evening light" },
];
