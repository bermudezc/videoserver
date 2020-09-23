
-- -----------------------------------------------------
-- Schema videostream
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `videostream` DEFAULT CHARACTER SET utf8 ;
USE `videostream` ;

-- -----------------------------------------------------
-- Table `mydb`.`expediente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `videostream`.`expediente` ;

CREATE TABLE IF NOT EXISTS `mydb`.`expediente` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `expediente` VARCHAR(45) NOT NULL COMMENT '',
  `caratula` VARCHAR(90) NULL COMMENT '',
  `nota` VARCHAR(145) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '')
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `videostream`.`salas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `videostream`.`salas` ;

CREATE TABLE IF NOT EXISTS `videostream`.`salas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `nombre` VARCHAR(90) NOT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '')
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `videostream`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `videostream`.`user` ;

CREATE TABLE IF NOT EXISTS `videostream`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `nombre` VARCHAR(90) NULL DEFAULT NULL COMMENT '',
  `user` VARCHAR(90) NULL DEFAULT NULL COMMENT '',
  `pass` VARCHAR(20) NULL DEFAULT NULL COMMENT '',
  `email` VARCHAR(90) NULL DEFAULT NULL COMMENT '',
  `rol` VARCHAR(20) NULL DEFAULT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '')
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `videostream`.`videos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `videostream`.`videos` ;

CREATE TABLE IF NOT EXISTS `videostream`.`videos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `nombre` VARCHAR(45) NOT NULL COMMENT '',
  `path` VARCHAR(90) NOT NULL COMMENT '',
  `nota` VARCHAR(90) NULL DEFAULT NULL COMMENT '',
  `fecha` DATETIME NULL DEFAULT NULL COMMENT '',
  `usuario_id` INT(11) NULL DEFAULT NULL COMMENT '',
  `sala_id` INT(11) NULL DEFAULT NULL COMMENT '',
  `expediente_id` INT(11) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  CONSTRAINT `sala_id`
    FOREIGN KEY (`sala_id`)
    REFERENCES `videostream`.`salas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `usuario_id`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `videostream`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `expediente_id`
    FOREIGN KEY (`id`)
    REFERENCES `mydb`.`expediente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `videostream`.`tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `videostream`.`tags` ;

CREATE TABLE IF NOT EXISTS `videostream`.`tags` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `detalle` VARCHAR(90) NOT NULL COMMENT '',
  `tiempo` INT(11) NOT NULL COMMENT '',
  `videos_id` INT(11) NOT NULL COMMENT '',
  PRIMARY KEY (`id`, `videos_id`)  COMMENT '',
  INDEX `fk_tags_videos1_idx` (`videos_id` ASC)  COMMENT '',
  CONSTRAINT `fk_tags_videos1`
    FOREIGN KEY (`videos_id`)
    REFERENCES `videostream`.`videos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `videostream`.`videoxusuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `videostream`.`videoxusuario` ;

CREATE TABLE IF NOT EXISTS `videostream`.`videoxusuario` (
  `usuario_id` INT(11) NOT NULL COMMENT '',
  `video_id` INT(11) NOT NULL COMMENT '',
  `comentario` VARCHAR(45) NULL DEFAULT NULL COMMENT '',
  `videos_id` INT(11) NOT NULL COMMENT '',
  `user_id` INT(11) NOT NULL COMMENT '',
  PRIMARY KEY (`usuario_id`, `video_id`, `videos_id`, `user_id`)  COMMENT '',
  INDEX `fk_videoxusuario_videos1_idx` (`videos_id` ASC)  COMMENT '',
  INDEX `fk_videoxusuario_user1_idx` (`user_id` ASC)  COMMENT '',
  CONSTRAINT `fk_videoxusuario_videos1`
    FOREIGN KEY (`videos_id`)
    REFERENCES `videostream`.`videos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_videoxusuario_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `videostream`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



DROP TABLE IF EXISTS `videostream`.`ExpedientesxUsuario` ;

CREATE TABLE IF NOT EXISTS `videostream`.`ExpedientesxUsuario` (
  `usuario_id` INT(11) NOT NULL COMMENT '',
  `expediente_id` INT(11) NOT NULL COMMENT '',
  `comentario` VARCHAR(45) NULL DEFAULT NULL COMMENT '',  
  PRIMARY KEY (`usuario_id`, `expediente_id`)  COMMENT '',  
  CONSTRAINT `fk_videoxusuario_expte`
    FOREIGN KEY (`expediente_id`)
    REFERENCES `videostream`.`expediente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_videoxusuario_user`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `videostream`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



insert into user values(null, 'carlos','carlos','carlos','sdfjd','Admin');




