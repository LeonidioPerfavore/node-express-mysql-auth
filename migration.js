import fs from 'fs';
import path from 'path';
import sequelize, { DataTypes } from 'sequelize';
import Migration from './models/migration.js';
import db from './db/db.js';
import fileDirName from './utils/helpers/file-dirname.js';
const { __dirname } = fileDirName(import.meta);

const logger = console;
const migrationsPath = path.join(__dirname, 'migrations');

export async function runMigrations() {

    const queryInterface = db.getQueryInterface();
    await queryInterface.createTable('_migrations', {
        filename: DataTypes.STRING,
        appliedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('current_timestamp'),
            allowNull: false
        }
    });

    logger.debug(`Scan folder "${migrationsPath}" for migrations`, { scope: 'migrations' });

    const [list, migrations] = await Promise.all([
        readDir(migrationsPath),
        Migration.findAll()
    ]);

    for (const file of list) {

        if (!file.match(/\.js$/)) {
            continue;
        }

        const appliedMigration = migrations.find((migration) => migration.filename === file);
        if (appliedMigration) {
            logger.debug(`Migration "${file}" was applied at ${appliedMigration.appliedAt}`, { scope: 'migrations' });
            continue;
        }

        logger.debug(`Migration "${file}" applying...`, { scope: 'migrations' });

        const m = import(path.join(migrationsPath, file))
            m.then(function(result) {
                result.up(queryInterface, sequelize);

                const item = new Migration({
                    filename: file,
                    appliedAt: Date.now()
                });
                item.save();
        })
    }

    function readDir(dir) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (errDir, files) => {
                if (errDir) {
                    return reject(errDir);
                }
                return resolve(files);
            });
        });
    }
}