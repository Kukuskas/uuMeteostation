"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { convertToObjectId, convertToDate } = require("./helpers/dao-common.js");

class DatasetMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, gatewayId: 1, type: 1, startDate: 1 }, { unique: true });
    await super.createIndex({ awid: 1, endDate: 1 });
    await super.createIndex({ awid: 1, type: 1, aggregated: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(this._prepareObject(uuObject));
  }

  async update(uuObject, lock = null) {
    const filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, this._prepareObject(uuObject), "NONE", lock);
  }

  async get(awid, id) {
    const filter = { awid, id };
    return await super.findOne(filter);
  }

  async getByTypeAndDate(awid, gatewayId, type, date) {
    gatewayId = convertToObjectId(gatewayId);
    date = convertToDate(date);
    const filter = {
      awid, gatewayId, type,
      startDate: { $lte: date },
      endDate: { $gte: date }
    };
    return await super.findOne(filter);
  }

  async listByAggregation(awid, type, aggregated, pageInfo = {}) {
    const filter = { awid, type, aggregated };
    return await super.find(filter, pageInfo);
  }

  async listByTypeAndDateRange(awid, gatewayId, type, startDate, endDate, pageInfo = {}) {
    gatewayId = convertToObjectId(gatewayId);
    startDate = convertToDate(startDate);
    endDate = convertToDate(endDate);
    const filter = {
      awid, gatewayId, type,
      startDate: { $gte: startDate },
      endDate: { $lte: endDate }
    };
    return await super.find(filter, pageInfo);
  }

  async lock(awid, id, lock) {
    const filter = { awid, id };
    return await super.lockOne(filter, lock);
  }

  async unlock(awid, id, lock) {
    const filter = { awid, id };
    return await super.unlockOne(filter, lock);
  }

  async deleteByTypeAndDate(awid, type, endBefore) {
    endBefore = convertToDate(endBefore);
    const filter = {
      awid, type,
      endDate: { $lte: endBefore }
    };
    return await super.deleteMany(filter);
  }

  async deleteByGatewayId(awid, gatewayId) {
    gatewayId = convertToObjectId(gatewayId);
    const filter = { awid, gatewayId };
    return await super.deleteMany(filter);
  }

  _prepareObject(uuObject) {
    uuObject.gatewayId = convertToObjectId(uuObject.gatewayId);

    for (const dateProp of ["startDate", "endDate"]) {
      uuObject[dateProp] = convertToDate(uuObject.dateProp);
    }

    uuObject.data = uuObject.data.map(entry => {
      let newEntry = { ...entry };
      newEntry.timestamp = convertToDate(newEntry.timestamp);
      return newEntry;
    });

    return uuObject;
  }
}

module.exports = DatasetMongo;
