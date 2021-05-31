"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { convertToObjectId, convertToDate, convertToDateString } = require("./helpers/dao-common.js");

const DEFAULT_SORT = { gatewayId: 1, type: 1, startDate: 1 };
class DatasetMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
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
    uuObject = await super.findOneAndUpdate(filter, this._prepareObject(uuObject), "NONE", lock);
    return this._prepareReturnObject(uuObject);
  }

  async get(awid, id) {
    const filter = { awid, id };
    let uuObject = await super.findOne(filter);
    return this._prepareReturnObject(uuObject);
  }

  async getByTypeAndDate(awid, gatewayId, type, date) {
    gatewayId = convertToObjectId(gatewayId);
    date = convertToDate(date);
    const filter = {
      awid,
      gatewayId,
      type,
      startDate: { $lte: date },
      endDate: { $gte: date },
    };
    let uuObject = await super.findOne(filter);
    return this._prepareReturnObject(uuObject);
  }

  async listByAggregation(awid, type, aggregated, pageInfo = {}, sort = DEFAULT_SORT) {
    const filter = { awid, type, aggregated };
    let uuObjectList = await super.find(filter, pageInfo, sort);
    uuObjectList.itemList = uuObjectList.itemList.map((item) => this._prepareReturnObject(item));
    return uuObjectList;
  }

  async listByTypeAndDateRange(awid, gatewayId, type, startDate, endDate, pageInfo = {}, sort = DEFAULT_SORT) {
    gatewayId = convertToObjectId(gatewayId);
    startDate = convertToDate(startDate);
    endDate = convertToDate(endDate);
    const filter = {
      awid,
      gatewayId,
      type,
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    };
    let uuObjectList = await super.find(filter, pageInfo, sort);
    uuObjectList.itemList = uuObjectList.itemList.map((item) => this._prepareReturnObject(item));
    return uuObjectList;
  }

  async lock(awid, id, lock) {
    const filter = { awid, id };
    return await super.lockOne(filter, lock);
  }

  async unlock(awid, id, lock) {
    const filter = { awid, id };
    return await super.unlockOne(filter, lock);
  }

  async deleteByTypeAndAggregationAndDate(awid, type, aggregated, endBefore) {
    endBefore = convertToDate(endBefore);
    const filter = {
      awid,
      type,
      aggregated,
      endDate: { $lte: endBefore },
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
      uuObject[dateProp] = convertToDate(uuObject[dateProp]);
    }

    return uuObject;
  }

  _prepareReturnObject(uuObject) {
    if (!uuObject) {
      return uuObject;
    }

    for (const dateProp of ["startDate", "endDate"]) {
      uuObject[dateProp] = convertToDateString(uuObject[dateProp]);
    }

    return uuObject;
  }
}

module.exports = DatasetMongo;
