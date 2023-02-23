
export
async function up(queryInterface, { DataTypes }) {
    await queryInterface.createTable('tokens', {
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
        },
        expired: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });
}

export
async function down(queryInterface) {
    await queryInterface.dropTable('tokens');
}