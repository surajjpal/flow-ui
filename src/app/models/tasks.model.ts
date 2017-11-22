export class Chronology {
  id: string;
  calendarType: string;
}

export class Time {
  hour: string;
  minute: string;
  nano: string;
  second: string;
  dayOfMonth: string;
  dayOfWeek: string;
  dayOfYear: string;
  month: string;
  monthValue: string;
  year: string;
  chronology: Chronology;
}

export class State {
  _id: string;
  statusCd: string;
  machineType: string;
  entityId: string;
  stateCd: string;
  stageCd: string;
  stateMachineInstanceModelId: string;
  assignedUserGroupCd: string;
  startTime: Time;
  endTime: Time;
  payload: string;
  fromStateCd: string;
  eventModel: string;
  parameters: [string, string];
  predictedParameters: [string, string];
}
