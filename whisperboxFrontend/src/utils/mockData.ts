import type { WhisperCardData } from '../components/ui/WhisperCard'

/** Mock whispers used by Feed and Admin pages during UI-only phase */
export const MOCK_WHISPERS: WhisperCardData[] = [
  {
    id: 1,
    anonymousName: 'Silent Panda',
    title: 'Anyone else struggling with finals?',
    content:
      'The exam schedule this semester is brutal. Three exams on the same day feels completely unreasonable. Is it just me, or does everyone feel this way?',
    date: 'Jun 12, 2026',
    status: 'NOT_SEEN',
  },
  {
    id: 2,
    anonymousName: 'Quiet Fox',
    title: 'The library closes too early',
    content:
      'Why does the library close at 8 pm? Some of us do our best work late at night and really need a quiet space. Can we petition for extended hours?',
    date: 'Jun 11, 2026',
    status: 'SEEN',
  },
  {
    id: 3,
    anonymousName: 'Gentle Storm',
    title: 'Shoutout to the cafeteria staff!',
    content:
      'The food quality improved a lot this semester and the staff always have a smile. Just wanted to give credit where it is due. 🙌',
    date: 'Jun 10, 2026',
    status: 'SEEN',
  },
  {
    id: 4,
    anonymousName: 'Brave Eagle',
    title: 'Professor cancelled class 10 min before',
    content:
      'I took two buses to get to campus and found out class was cancelled via a group chat. A proper email 24 hours ahead would have been appreciated.',
    date: 'Jun 9, 2026',
    status: 'NOT_SEEN',
  },
  {
    id: 5,
    anonymousName: 'Swift River',
    title: 'Internship referral tips?',
    content:
      'Does anyone have advice on getting referrals for tech internships? I have been applying cold for months with very few callbacks. Any guidance helps.',
    date: 'Jun 8, 2026',
    status: 'NOT_SEEN',
  },
  {
    id: 6,
    anonymousName: 'Calm Lynx',
    title: 'WiFi in Building C is terrible',
    content:
      'Cannot attend online lectures from Building C. The signal drops every five minutes. IT said they are working on it — has been two months now.',
    date: 'Jun 7, 2026',
    status: 'SEEN',
  },
]
