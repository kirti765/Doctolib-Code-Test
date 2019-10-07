import knex from "knexClient";
import getAvailabilities from "./getAvailabilities";

describe("getAvailabilities", () => {
  beforeEach(() => knex("events").truncate());
 let availabilities;
  describe("case 1", () => {
    it("test 1", async () => {
      availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);
      for (let i = 0; i < 7; ++i) {
        expect(availabilities[i].slots).toEqual([]);
      }
    });
  });

  describe("case 2", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      availabilities = await getAvailability();

      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("case 3", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2018-08-04 09:30"),
          ends_at: new Date("2018-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      availabilities = await getAvailability();
      expect(availabilities[6].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);
    });
  });

  async function getAvailability() {
    const availability = await getAvailabilities(new Date("2014-08-10"));
    expect(availability.length).toBe(7);

    expect(String(availability[0].date)).toBe(
        String(new Date("2014-08-10"))
    );
    expect(availability[0].slots).toEqual([]);

    expect(String(availability[1].date)).toBe(
        String(new Date("2014-08-11"))
    );
    return availability;
  }

});
