module.exports = (sequelize, DataTypes) => {
	let Word = sequelize.define('Word', {
		word: {
			type:  DataTypes.STRING,
			validate: {len: [1, 255]},
			allowNull: false
		},
		strength: {
			type: DataTypes.INTEGER,
			validate: {min: -1, max: 4}
		},
		meaning: {
			type: DataTypes.STRING,
			validate: {len: [1, 255]}
		}
	},{
		timestamps: false
	});

	Word.associate = models => {
		Word.belongsTo(models.Language, {
			as: 'language',
			onDelete: 'CASCADE',
			foreignKey: {allowNull: false}
		});
		Word.belongsTo(models.User, {
			as: 'user',
			onDelete: 'CASCADE',
			foreignKey: {allowNull: false}
		});
	};

	return Word;
};