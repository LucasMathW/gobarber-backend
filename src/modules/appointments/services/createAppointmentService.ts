import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface Request {
  provider_id: string;
  date: Date;
}

class createAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentOfDate = startOfHour(date);

    const findAppointmentInSomeDate = await appointmentsRepository.findByDate(
      appointmentOfDate,
    );

    if (findAppointmentInSomeDate) {
      throw new AppError('Appointment already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentOfDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default createAppointmentService;