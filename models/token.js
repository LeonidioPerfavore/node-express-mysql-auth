import { DataTypes, Model } from 'sequelize';
import db from '../db/db.js';

class Token extends Model {}

const model = Token.init({
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT, allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: db,
    tableName: 'tokens',
});

export default model;