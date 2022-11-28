import { EventInput } from '@fullcalendar/angular';
import { NTask } from '../detail/task-dialog/task-dialog';
import * as moment from 'moment';

let eventGuid = 100;

export const INITIAL_TASKS: NTask[] = [
    {
        id: null,
        title: 'Packet Monster Sales',
        content: '',
        due_date: moment('2021-06-09'),
        due_time: '10:00 AM',
        reminder_date: moment('2021-06-09'),
        reminder_time: '10:00 AM',
        owner_id: 1,
    },
    {
        id: null,
        title: 'Ux design meeting', 
        content: '',
        due_date: moment('2021-06-09'),
        due_time: '11:00 AM',
        reminder_date: moment('2021-06-09'),
        reminder_time: '11:00 AM',
        owner_id: 1
    },
    {
        id: null,
        title: 'Family', 
        content: '',
        due_date: moment('2021-06-10'),
        due_time: '18:00',
        reminder_date: moment('2021-06-09'),
        reminder_time: '12:00 AM',
        owner_id: 1
    },
    {
        id: null,
        title: 'Presentation', 
        content: '',
        due_date: moment('2021-06-28'),
        due_time: '06:00 PM',
        reminder_date: null,
        reminder_time: '',
        owner_id: 1
    },
    {
        id: null,
        title: 'Holiday', 
        content: '',
        due_date: moment('2021-07-02'),
        due_time: '06:00 PM',
        reminder_date: null,
        reminder_time: '',
        owner_id: 1
    }
];

export function createEventId() {
  return String(eventGuid++);
}