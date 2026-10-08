import type { Scenario } from '../types'

// Each scenario: 3 curated interpretations (reasonable, speculative, absurd),
// each with 3 curated follow-ups. Deeper levels come from templates.ts.
// To add a scenario, append one object here. Nothing else needs to change.
export const SCENARIOS: Scenario[] = [
  {
    id: 'wave',
    label: 'The Unreturned Wave',
    teaser: 'Corridor. Second floor. Graham.',
    incident:
      'In the second-floor corridor, you waved at Graham from Procurement. Graham did not wave back.',
    grounded:
      'Graham was carrying a sandwich and thinking about the sandwich. He did not see the wave. If he did, he has already forgotten it. Nobody is keeping score of waves. You are the only person who has been in that corridor emotionally.',
    vars: { who: 'Graham', thing: 'the wave', place: 'the second-floor corridor' },
    kids: [
      {
        t: 'Graham was carrying a laptop, a lanyard and a sandwich, and had no free hand. The wave was received and filed for later.',
        ev: 'Witness (you) confirms Graham was carrying three items. Sandwich: confirmed.',
        alt: 'In this timeline Graham waves with his elbow. Nobody notices. It is the best timeline and it has been discontinued.',
        k: [
          { t: 'He did see it and nodded, but the nod was too small to register. A micro-nod is still a nod. Legally.' },
          { t: 'Graham was also avoiding someone else in the corridor, and you were collateral in an unrelated avoidance.' },
          { t: 'The sandwich was the only item Graham was truly protecting. You have been outranked by egg mayonnaise.' },
        ],
      },
      {
        t: 'Graham saw the wave, but has recently decided to wave only at people of his own seniority. A memo may exist.',
        ev: 'No memo located. Search of the memo drawer found a menu from a Thai restaurant.',
        alt: 'In this timeline there is a memo. It is two sentences long and refers to you as "the Tuesday one".',
        k: [
          { t: 'Even without a memo, there may be a general mood on the second floor, and moods are usually at least one person’s fault.' },
          { t: 'The memo exists but was sent only to people who were already waving correctly. You were not on the list because the list is for people who know.' },
          { t: 'The memo is on letterhead you have never seen, from a Department of Corridors, which holds all waving jurisdiction below the fourth floor.' },
        ],
      },
      {
        t: 'The wave was read by Graham as an opening move. He is now preparing a counter-wave, to be delivered at a time and place of his choosing.',
        ev: 'Graham’s capacity for strategic waving is not established. Graham has not been asked.',
        alt: 'In this timeline the counter-wave arrives in March, during a fire drill, and is devastating.',
        k: [
          { t: 'People do delay greetings until they can do them properly. This is called being busy, and Graham is on record as being busy.' },
          { t: 'The counter-wave is already scheduled and will be performed in front of a witness, ideally someone from Facilities.' },
          { t: 'Graham has hired a wave consultant, who advises that you be waved at only once, from a distance, with a lanyard-based pause.' },
        ],
      },
    ],
    esc: [
      'Procurement has opened a formal enquiry into the wave. It has been assigned to Graham, who is conflicted, and also unavailable until the sandwich is finished.',
      'A tribunal of three lanyards convenes in the second-floor corridor. The wave is entered into the minutes as "an act of friendly intent, contested".',
      'The wave becomes a standing item at the Quarterly Board Meeting, under Other. It is the only item anyone remembers.',
    ],
  },
  {
    id: 'read',
    label: 'Read at 14:02',
    teaser: 'A message. A timestamp. Silence.',
    incident:
      'You messaged Dani at 13:40: "Are we still on for Saturday?" It was marked Read at 14:02. There has been no reply.',
    grounded:
      'Dani saw the message while doing something else and meant to reply. They will, probably within the hour, with a single word. Saturday was never in question. Only the reply was.',
    vars: { who: 'Dani', thing: 'the message', place: 'the chat window' },
    kids: [
      {
        t: 'Dani opened it in a queue, intended to reply properly later, and then the queue moved. This is the most common cause of all unanswered messages.',
        ev: 'Dani has been in a queue before. Queues are well documented.',
        alt: 'In this timeline Dani replies at 14:40 with a thumbs-up. You spend the intervening 38 minutes in an unrelated and avoidable state.',
        k: [
          { t: 'The queue was at a pharmacy. People spend a long time at pharmacies, mostly looking at the same shelf of plasters.' },
          { t: 'Dani is in a queue because Dani is organising something, and the something involves Saturday, and also you.' },
          { t: 'It is the same queue every unanswered message ends up in. There is only one. It is not moving because someone is paying in coins.' },
        ],
      },
      {
        t: 'Dani read it, noticed the question mark, and is drafting a reply that is warm but non-committal, which takes longer than either alone.',
        ev: 'No typing indicator observed. This is consistent with drafting. It is also consistent with everything else.',
        alt: 'In this timeline the draft is deleted at 14:19 and replaced with "Yes!", which Dani then regrets for different reasons.',
        k: [
          { t: 'Dani may be checking their calendar, which is the polite thing to do, and is therefore being held against them.' },
          { t: 'Dani is consulting a third person about whether Saturday is a good idea. The third person is, at this moment, replying "hmm".' },
          { t: 'The reply has been redrafted so often that it exists in forty versions, none of which is a message, and all of which are tremendously sincere.' },
        ],
      },
      {
        t: 'The message was read by Dani’s phone and not by Dani. Phones have begun forming opinions about Saturday, and yours is on the losing side of a vote.',
        ev: 'Phones are not known to read. This has been noted on the form, in pencil.',
        alt: 'In this timeline the two phones meet at a neutral location and exchange hostages (a charger).',
        k: [
          { t: 'Notifications sometimes mark messages as read when a phone is unlocked in a pocket, which means the whole case may rest on a small icon.' },
          { t: 'The icon is correct but has been tampered with by someone who wants you to think about Saturday for longer.' },
          { t: 'A committee of phones met in a bag and voted 3 to 1 against Saturday. The dissenting phone was yours, which is irrelevant, because it was not in the room.' },
        ],
      },
    ],
    esc: [
      'The messaging platform has been asked to release the exact millisecond at which Dani read the message. It has politely declined and offered a new set of stickers.',
      'A Saturday Working Group is established. Membership: you, Dani, and an unspecified third party who has been in the group since before you.',
      'The timestamp 14:02 is declared a national number. It is printed on tote bags. You are required to carry one.',
    ],
  },
  {
    id: 'invite',
    label: 'Quick Chat (No Agenda)',
    teaser: 'Calendar invite. 16:48. Two attendees.',
    incident:
      'At 16:48, Helen, your manager, sent a calendar invite for tomorrow at 09:15 titled "Quick chat". There is no agenda and no description. The only other attendee is you.',
    grounded:
      'Helen needs to ask about something small and administrative, such as annual leave or a document. "Quick chat" means a quick chat. The empty description means she did not think it needed one.',
    vars: { who: 'Helen', thing: 'the invite', place: 'Meeting Room 3' },
    kids: [
      {
        t: 'Helen wants to check in about something small, and "quick chat" is the phrase people use for small things. It is booked for 15 minutes, which is not a number associated with doom.',
        ev: 'Invite length: 15 minutes. Doom, per Institute tables, requires a minimum of 30.',
        alt: 'In this timeline the chat is about a shared document’s sharing settings. You are relieved for three minutes and then suspicious of the relief.',
        k: [
          { t: 'It is about the shared document. Shared documents cause most quick chats and every follow-up.' },
          { t: 'It is about the shared document, but the document is a pretext, and underneath it is a conversation about ownership, which is how they say it when they mean you.' },
          { t: 'The shared document has become sentient and requested a one-to-one with you, using Helen’s account because it cannot yet access a calendar.' },
        ],
      },
      {
        t: '"Quick" is doing a lot of work. Helen has chosen the smallest possible word to carry a very large announcement, like a van delivering a sofa in a tote bag.',
        ev: 'The word "quick" appears in both small and large announcements. In the large ones it is a lie.',
        alt: 'In this timeline the announcement is large but good, and you are unable to enjoy it because you have already finished grieving.',
        k: [
          { t: 'Reorganisations are announced in large rooms, not by invitation for two. A two-person meeting is, structurally, not an announcement.' },
          { t: 'It is a reorganisation, but a quiet one, and you are the only part of it still pending.' },
          { t: 'You are being offered a job in Meeting Room 3 itself, as a permanent fixture. Helen has already measured the chair.' },
        ],
      },
      {
        t: 'The invite was sent at 16:48, in the last twelve minutes of the day, so you could not reply, in the way a hawk waits for a field to go quiet.',
        ev: 'Helen’s calendar shows she sends most invites at 16:48. The hawk theory has no known precedent.',
        alt: 'In this timeline you reply at 16:49 and Helen’s calendar, which is apparently on a timer, declines it.',
        k: [
          { t: 'People send invites at 16:48 because 16:48 is when they remember things. Remembering is not a plot.' },
          { t: 'Helen has drafted the conversation in advance and rehearsed it in a car park, and the invite is step six of a seven-step plan.' },
          { t: 'Sending at 16:48 is a ritual of the Order of Calendar-Keepers. Helen is a third-degree member. You have been invited to a degree of your own.' },
        ],
      },
    ],
    esc: [
      'Helen’s manager has been added to the invite. His name is now in the attendee list and in your ribcage.',
      'The Quick chat is rescheduled to Thursday, then to TBC, then to a recurring series titled "Quick chat (ongoing)", which no one will ever be able to delete.',
      'A second invite arrives, titled "Re: Quick chat". It is from you. You have no memory of sending it.',
    ],
  },
  {
    id: 'bagging',
    label: 'Unexpected Item',
    teaser: 'Self-checkout. Satsumas. A voice.',
    incident:
      'At the self-checkout, the machine announced "Unexpected item in the bagging area." The item was a bag of satsumas. You had put them there.',
    grounded:
      'The scale disagreed with the weight on the screen by a few grams. An assistant tapped a screen and it carried on. Hundreds of people hear that sentence every day. The satsumas are fine.',
    vars: { who: 'the machine', thing: 'the satsumas', place: 'the self-checkout' },
    kids: [
      {
        t: 'The sensor weighed the satsumas, found the number differed from the one on screen, and panicked. This is what scales do. It is not personal.',
        ev: 'Satsuma weight: variable. Scale mood: unrecorded.',
        alt: 'In this timeline an assistant arrives, waves a key card, and leaves. The key card is the closest thing to authority you will encounter this week.',
        k: [
          { t: 'A difference of eight grams is enough to trigger the announcement. Eight grams is about one grape, or a small amount of guilt.' },
          { t: 'The scale is old and has been through things, and your satsumas reminded it of a previous customer.' },
          { t: 'The machine is trying to tell you something in the only language it has, which is the word "unexpected", in a voice recorded by an actor who was told to sound disappointed.' },
        ],
      },
      {
        t: '"Unexpected" implies someone expected otherwise. The store has a record of what you were supposed to buy, and the satsumas were not on it.',
        ev: 'Your shopping history is held by the store. It is not known to include a plan.',
        alt: 'In this timeline the store’s predictions are right and you had been planning to buy pears all along, subconsciously, since 2019.',
        k: [
          { t: 'Stores track purchases to forecast stock. This does not mean anyone is looking at you. It means a spreadsheet is looking at satsumas.' },
          { t: 'The spreadsheet has flagged you as a customer who "drifts", and the satsumas were the first irregularity in a six-week pattern.' },
          { t: 'The store keeps a file on your fruit. It is thicker than your dental file and has been annotated by an intern.' },
        ],
      },
      {
        t: 'The satsumas are unexpected because they were replaced overnight with a visually identical set, and the machine can tell.',
        ev: 'No known process replaces satsumas with satsumas. The Institute has not ruled out a process.',
        alt: 'In this timeline the replacement satsumas are better, and you are asked to leave them.',
        k: [
          { t: 'Citrus is hard to tell apart. If one satsuma is slightly different, that is normal. They are not issued in matching sets.' },
          { t: 'Someone at a farm is watching you, specifically because of the satsumas, and has been since the March inventory.' },
          { t: 'The original satsumas have entered witness protection. These ones were told to say nothing, and are saying nothing with unusual confidence.' },
        ],
      },
    ],
    esc: [
      'The assistant arrives, looks at the satsumas, looks at you, and says "All fine" in a tone that suggests otherwise and a form to be filed.',
      'Every self-checkout in the building begins announcing "Unexpected item in the bagging area" at slightly different speeds, like a choir that has not rehearsed.',
      'The machine has submitted its report to Head Office. The report is one line long. The line is your name.',
    ],
  },
  {
    id: 'dish',
    label: 'The Washed Dish',
    teaser: 'Casserole. Neighbour. Seven words.',
    incident:
      'You returned your neighbour Moira’s casserole dish, washed. She said, "Oh, you didn’t have to wash it." You said, "It was no problem." The conversation then ended.',
    grounded:
      'Moira was handed a clean dish and said what people say when handed a clean dish. She then thought about her afternoon. The dish is back in a cupboard, doing dish things.',
    vars: { who: 'Moira', thing: 'the dish', place: 'Moira’s doorstep' },
    kids: [
      {
        t: 'People say this when handed a clean dish. It is a phrase, not a position. It is in the same family as "you shouldn’t have" and "I wouldn’t hear of it".',
        ev: 'Phrase appears in the standard book of thank-yous, page 4, between "lovely" and "honestly".',
        alt: 'In this timeline Moira says nothing, and you spend a week wondering why she did not say the line.',
        k: [
          { t: 'Moira was probably thinking about her own kitchen, her own afternoon and a pie she has no time to make. You were mostly background.' },
          { t: 'Moira also felt something about the dish, but it was gratitude with a trace of obligation, which is the tax on casseroles.' },
          { t: 'The phrase has a long history, and was first used to decline a clean pot in 1743, in a village that is no longer on any map.' },
        ],
      },
      {
        t: 'Moira had planned to wash it herself, as part of a small ritual in which the dish comes back dirty and is then restored. By washing it you removed a step in a process you did not know existed.',
        ev: 'No ritual documented. Moira’s kitchen was not inspected, though the door was ajar.',
        alt: 'In this timeline you return it dirty and Moira says "Oh, bless you" with an intensity that unsettles you for a year.',
        k: [
          { t: 'Even if there was a ritual, it was Moira’s, and she would not hold you to it, as you did not have the manual.' },
          { t: 'The ritual is one of many on the street, and all of them are known to everyone except you.' },
          { t: 'The street has a charter. It is nine pages, signed in a church hall. Page seven is about dishes.' },
        ],
      },
      {
        t: '"You didn’t have to" was an instruction. By washing the dish you breached an arrangement, and Moira is now owed a dish, in kind, in a condition of her choosing.',
        ev: 'The Institute is unaware of any arrangement. The Institute is unaware of many arrangements.',
        alt: 'In this timeline you send a replacement dish, which is cleaner, and the resulting dish arms race lasts until 2031.',
        k: [
          { t: 'A debt of one dish is small and easily settled with a nod and a plate of something.' },
          { t: 'The debt is not one dish but a dish and a further gesture, to be determined by Moira over a period, with the advantage hers.' },
          { t: 'Moira has opened a ledger. It lists one casserole dish, one reproachful kindness, and a column headed Interest.' },
        ],
      },
    ],
    esc: [
      'Moira mentions the dish to another neighbour, as an anecdote. It is warm, accurate and slightly too long, and it is now street property.',
      'A returned-dish committee convenes at No. 14. It decides that the washing was "a lot". It does not say a lot of what.',
      'Moira, in an unrelated gesture, returns a different dish to you, unwashed, with a note: "No pressure." The pressure is total.',
    ],
  },
]
