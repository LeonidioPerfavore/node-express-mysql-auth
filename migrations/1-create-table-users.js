
export
async function up(queryInterface, { DataTypes }) {
    await queryInterface.createTable('users', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING(255), allowNull: false },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        activated: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        activation_link: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });
}

export
async function down(queryInterface) {
    await queryInterface.dropTable('users');
}