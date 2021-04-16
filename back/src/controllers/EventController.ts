import { BodyParams, Context, Controller, Delete, Get, PathParams, Post, Put, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Status } from "@tsed/schema";
import { getRepository } from "typeorm";
import { Event } from "../entities/Event";
import * as uuid from 'uuid';

@Controller('/events')
export class EventController {
    private eventRepository = getRepository(Event);

    @Get('/')
    async listAll() {
        const events = await this.eventRepository.find();
        return events.map(({ uuid }) => ({ uuid }));
    }

    @Get("/:uuid")
    async get(@PathParams("uuid") uuid: string) {
        const event = await this.eventRepository.findOne({ uuid });

        if (!event) {
            throw new NotFound("Could not find requested event");
        }

        return {
            title: event.title,
            description: event.description,
            beginAt: event.beginAt,
            endAt: event.endAt,
        };
    }

    @Post('/')
    @Status(201)
    async post(
        @BodyParams(Event) event: Event,
        @Context() ctx: Context,
    ) {
        const createdEvent = await this.eventRepository.create({
            uuid: uuid.v4(),
            title: event.title,
            description: event.description,
            beginAt: event.beginAt,
            endAt: event.endAt,
            projects: [],
        });
        await this.eventRepository.save(createdEvent);

        // TODO: Ne pas hardcoder l'url.
        ctx.response.location(`/api/v1/events/${createdEvent.uuid}`);
    }

    @Put('/:uuid')
    @Status(204)
    async put(@PathParams("uuid") uuid: string, @BodyParams(Event) event: Event) {
        const existingEvent = await this.eventRepository.findOne({ uuid });
        if (!existingEvent) {
            throw new NotFound("Could not find requested event");
        }

        await this.eventRepository.update({ uuid }, {
            title: event.title,
            description: event.description,
            beginAt: event.beginAt,
            endAt: event.endAt,
        });
    }

    @Delete('/:uuid')
    @Status(200)
    async delete(@PathParams("uuid") uuid: string) {
        const existingEvent = await this.eventRepository.findOne({ uuid });
        if (!existingEvent) {
            throw new NotFound("Could not find requested event");
        }

        await this.eventRepository.delete({ uuid });
    }
}
