import type { Vars } from '../types'

type Trio = [string[], string[], string[]] // reasonable, speculative, absurd

// Slots: {who} {thing} {THING} {place} {n} (minutes since the incident).
// Written as continuations so they read acceptably after any parent.
// TIERS[0] depth 1, [1] depth 2, [2] depths 3-4, [3] depths 5-6.
export const TIERS: Trio[] = [
  [
    [
      'The simplest explanation is that {who} was busy, distracted, or both. Most events like this are far more memorable to the person who experienced them.',
      'Nothing about {thing} requires a second look. It happened, it was ordinary, and a similar one is happening somewhere else right now with no analysis at all.',
      '{who} likely did not give {thing} a second thought. This is statistically the least comfortable explanation, because it gives you nothing to work with.',
    ],
    [
      '{who} noticed {thing} and said nothing, because they are holding a position you have not been told about.',
      '{thing} was a test. Nobody informed you, since that would spoil the findings.',
      'There is a pattern. {thing} is the third in a sequence, and you have only noticed because you have started to look.',
    ],
    [
      '{thing} was recorded. The recording is being played at a small gathering of {who}’s friends, with commentary and light snacks.',
      '{place} has a memory of what happened and will recall it at the worst possible moment, ideally in front of a stranger.',
      '{thing} has been entered into a registry that does not exist yet, and is holding a place until it does.',
    ],
  ],
  [
    [
      'If so, the practical impact is small. Most people forget most things within a day, including things that are about you.',
      'A reasonable person would, at this point, move on. A reasonable person has been invited and has sent apologies.',
      'Even then, {who} has their own concerns, most of which are larger than {thing}.',
    ],
    [
      'In that case {who} has told one other person, who has formed a view, which is now travelling.',
      'That would mean {who} has been revising their opinion of you since {place}, in small, silent increments.',
      'It would suggest a larger pattern, visible to everyone except you, and obvious in hindsight.',
    ],
    [
      'At which point the matter is no longer yours, having been adopted by a nearby institution that was looking for something to do.',
      'In which case a small tribunal has formed in a room you will never see, and it already has biscuits.',
      'That would explain why {place} felt different when you left it. It had made up its mind.',
    ],
  ],
  [
    [
      'A calm person would check the facts here. The facts are in short supply, so a calm person would then make a tea.',
      'Realistically, {who} has not thought about {thing} since. You have thought about it a great deal, which is a lot for something realistic.',
      'It may all be a coincidence, and coincidences are far more common than plots, though they are never as well attended.',
      'This explanation is plausible but no longer necessary. Nothing is being asked of you. Nothing is happening in {place}.',
    ],
    [
      '{who} has now mentioned {thing} to two further people, each of whom added a detail. By the end of the week it will be a story with a middle.',
      'Your reputation around {place} has shifted by roughly one notch, which is all that is needed, and which no explanation can reverse.',
      'Someone has started a private note about {thing}. It is brief, partly accurate, and titled with a single word you would not have chosen.',
      'People who were not present for {thing} now hold firm views on it. The views are consistent with each other, which is the most worrying part.',
    ],
    [
      'A panel of retired mediators has been convened to review {thing}. They have never met you and have already agreed on a verdict, which they will not share.',
      'An archive in a decommissioned library now holds a file called "{THING}". A clerk adds to it every Thursday. He has never been told why.',
      'A small plaque is being prepared for {place}. It will read: HERE, {n} MINUTES AFTER THE INCIDENT, SOMETHING WAS CONSIDERED. It will be installed without ceremony.',
      'The matter has passed through four departments, each of which stamped it and none of which understood it. It is more official than before and no more true.',
    ],
  ],
  [
    [
      'At this distance from the original event, a calm observer would note that {n} minutes have passed and nothing has happened to anyone.',
      'Somewhere beneath all this is a very small, very ordinary event. It is still there. It has not moved. It is waiting, like a bus.',
      'None of this has been verified. In fairness, none of it has been contradicted either, which is how the whole structure keeps standing.',
      'The reasonable position, that nothing is wrong, remains available. It is on a lower floor. The lift is working.',
    ],
    [
      'The consequences have outgrown {thing}. Plans, friendships and a minor holiday are now conditional on something you have decided {who} decided.',
      'You now require {who} to behave in a way that would confirm the theory, and have begun reading neutral behaviour as a form of cover.',
      'The theory has two supporting pillars: a feeling, and another feeling. Together they are structurally sound as long as nobody leans on them.',
      'A decision has been taken, in advance of any facts, that things will be awkward from now on. The awkwardness is already booked.',
    ],
    [
      'The matter has been referred to an international body in Geneva, who referred it to a smaller body in Lyon, who referred it back to {place} with a polite note.',
      'Historians of the future will describe {thing} as "the pivot". They will be wrong, but thorough, and the footnotes will be tremendous.',
      'The Institute’s own filing system has become aware of {thing} and is refusing to file anything else until it is resolved.',
      'The universe has been informed. It has sent no reply, but it has read the message, and the timestamp has been noted.',
    ],
  ],
]

export const tierFor = (depth: number) => (depth <= 1 ? 0 : depth === 2 ? 1 : depth <= 4 ? 2 : 3)

export const ALT_TIMELINES = [
  'In this timeline you said nothing, did nothing, and it faded by Thursday. The timeline has been closed for lack of drama.',
  'In this timeline {who} apologises first, for something unrelated, and everyone leaves slightly better off. It has been marked implausible.',
  'In this timeline you mention it casually, {who} says "Oh, that?", and the entire structure collapses in four seconds. Counsel advises against.',
  'In this timeline you move house. The new house also has {thing}. You move again.',
  'In this timeline it turns out to be about {place}, which is under review.',
  'In this timeline you write {who} a long message, do not send it, and feel better. The draft is archived under Pending.',
  'In this timeline everyone involved is a little kinder than expected. The Institute finds this tiresome.',
  'In this timeline nothing is different. You simply noticed it, and noticing is a form of difference. The Institute is looking into noticing.',
]

export const EV_NOTES = {
  reasonable: [
    'Circumstantial. A plausible event exists nearby but cannot be placed at the scene.',
    'Partially supported. One witness (you) says it could have happened.',
    'Consistent with the facts. Also consistent with a different set of facts.',
  ],
  speculative: [
    'No evidence located. A search of the premises found a mug.',
    'Based on a feeling, which the Department does not accept as currency but keeps as a souvenir.',
    'Source: inference upon inference. Both inferences cite each other.',
    'Evidence pending. Pending since the start of this branch.',
  ],
  absurd: [
    'The evidence department has declined to comment.',
    'Exhibit missing. Exhibit may never have existed. Exhibit is the subject of a separate case.',
    'Submitted without evidence but with enormous confidence, which has been noted.',
    'Not evidence. Not even a theory. The Department has classed this as weather.',
  ],
  escalation: [
    'Management has reviewed the evidence and asked to see more of it.',
    'Management has no evidence. Management has a meeting.',
  ],
}

// Used after the curated scenario escalations run out, and for custom incidents.
export const ESCALATION_LADDER = [
  'Management has escalated {thing} to a Senior Reviewer of Related Matters. The Reviewer is on a boat. The boat is, regrettably, also in the file.',
  'A parliamentary sub-committee requests the full history of {thing}, in triplicate, with the middle copy to be returned unread.',
  'The Institute has contacted {place}, which declined to be interviewed. This is being treated as a statement.',
  'A commemorative stamp featuring {thing} has been approved by a postal authority. It is first class. You have been asked to lick it.',
  'The Moon has been informed. It has taken no position, but is understood to be aware.',
  'The matter has been escalated beyond management, past the board, and into a quiet room where an unknown person nods. The nod is not to be taken lightly.',
]

export const FLAVOURS: { test: RegExp; vars: Vars }[] = [
  {
    test: /\b(text|texts|message|messages|email|emails|reply|replied|read receipt|seen|left on read|dm|whatsapp)\b/i,
    vars: { who: 'the recipient', thing: 'the message', place: 'the chat window' },
  },
  {
    test: /\b(said|says|laughed|laugh|waved|ignored|looked|smiled|smile|greeted|hello|stared|asked)\b/i,
    vars: { who: 'the other person', thing: 'the exchange', place: 'the room' },
  },
]
export const DEFAULT_VARS: Vars = { who: 'the other party', thing: 'the incident', place: 'the vicinity' }

export const TIREDNESS_CONSIDERED = [
  'relocating',
  'a change of name',
  'a quieter career',
  'a coastal town where nobody waves',
  'a long sabbatical',
  'becoming a lighthouse keeper',
]

// Narrator status messages. {m} = minutes since incident, {km} = distance, {c} = something considered.
export const NARRATOR = {
  start: 'Case file opened. The incident has been logged. It did not ask to be.',
  expand: [
    'A second interpretation has been discovered. Unfortunately.',
    'Three new interpretations filed. None were requested.',
    'The evidence department has declined to comment.',
    'The original incident occurred {m} minutes ago. You have now considered {c}.',
    'Distance from original incident: {km} km. Please keep your arms inside the thought.',
    'Note: nobody has asked you to analyse this.',
    'Supporting facts remain at one. It is the original incident.',
    'Your mental gymnastics have been scored. The judges are quiet.',
    'Another branch. The Institute does not have enough clipboards.',
  ],
  deep: [
    'You have reached a conclusion unsupported by any available facts.',
    'Thoughts at this depth are load-bearing for other people’s countries.',
    'The original incident is no longer visible from here.',
  ],
  escalate: [
    'Management has been notified. Management is also concerned.',
    'Escalation received. Someone with a lanyard has sighed.',
    'Management has read your concern and raised it, privately, to a higher concern.',
  ],
  undo: 'Previous thought retracted. The retraction has been filed beside it.',
  reality: 'Return to Reality initiated. Please remain seated. Please remain ordinary.',
  resume: 'Reality has been paused. It said it would wait.',
  revisit: 'That branch has already been explored. It remembers.',
  fullNodes: 'Capacity reached. The Institute has run out of paper, tape and patience, in that order.',
  fullDepth: 'Maximum depth reached. Nothing further down is yours to analyse.',
  restart: 'Case file reset. The incident is back to being only one incident.',
}

export const POPUPS = [
  { id: 'records', title: 'RECORDS DEPT.', body: 'Thank you for your submission. It has been placed in a pile. The pile is now yours.' },
  { id: 'compliance', title: 'COMPLIANCE', body: 'An absurd branch has been opened. You are not required to confirm that you know it is absurd. We would simply like you to know that we know.' },
  { id: 'audit', title: 'INTERNAL AUDIT', body: 'Several of your assumptions are now supporting one another. This is called a load-bearing guess. Please do not remove the bottom one.' },
  { id: 'surveyors', title: 'SURVEYORS', body: 'Distance from the original incident now exceeds the legal definition of “nearby”. Your postcode has been updated.' },
  { id: 'evidence', title: 'EVIDENCE DEPT.', body: 'Supporting evidence for the current position stands at one item (the original incident). Efforts to locate a second item have been suspended.' },
  { id: 'facilities', title: 'FACILITIES', body: 'The Institute is running low on tape. Please consider a smaller disaster.' },
  { id: 'management', title: 'MANAGEMENT', body: 'Management has been notified. Management is also concerned.' },
  { id: 'full', title: 'REGISTRY', body: 'Maximum capacity reached. Your case file is now eligible for a report. Please take it somewhere.' },
]
