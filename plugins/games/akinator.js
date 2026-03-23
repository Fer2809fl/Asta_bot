import fetch from 'node-fetch'

async function getRcanal() {
    try {
        const thumb = await (await fetch(global.icono)).buffer()
        return {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.channelRD?.id || "120363399175402285@newsletter",
                serverMessageId: '',
                newsletterName: global.channelRD?.name || "『𝕬𝖘𝖙𝖆-𝕭𝖔𝖙』"
            },
            externalAdReply: {
                title: global.botname || 'ᴀsᴛᴀ-ʙᴏᴛ',
                body: global.dev || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴇʀɴᴀɴᴅᴏ',
                mediaType: 1,
                mediaUrl: global.redes,
                sourceUrl: global.redes,
                thumbnail: thumb,
                showAdAttribution: false,
                containsAutoReply: true,
                renderLargerThumbnail: true
            }
        }
    } catch { return {} }
}

// ====================================================================
// ÁRBOL DE DECISIÓN EXTENDIDO — más de 100 personajes posibles
// Nodos rama: { pregunta, si, no }
// Nodos hoja: { resultado, emoji, descripcion }
// ====================================================================
const arbol = {
    pregunta: '¿Tu personaje es una persona real (no ficticia)?',
    si: {
        pregunta: '¿Tu personaje sigue vivo actualmente?',
        si: {
            pregunta: '¿Es famoso en todo el mundo?',
            si: {
                pregunta: '¿Es principalmente del mundo del entretenimiento (música, cine, TV)?',
                si: {
                    pregunta: '¿Es músico o cantante?',
                    si: {
                        pregunta: '¿Es hombre?',
                        si: {
                            pregunta: '¿Canta en español o reggaetón?',
                            si: {
                                pregunta: '¿Es puertorriqueño?',
                                si: { resultado: 'Bad Bunny', emoji: '🐰', descripcion: 'Cantante de reggaetón puertorriqueño, uno de los más escuchados del mundo' },
                                no: {
                                    pregunta: '¿Su nombre artístico tiene la palabra "Peso" o un número?',
                                    si: { resultado: 'Peso Pluma', emoji: '🎵', descripcion: 'Cantante mexicano de corridos tumbados' },
                                    no: { resultado: 'J Balvin', emoji: '🎤', descripcion: 'Cantante colombiano de reggaetón' }
                                }
                            },
                            no: {
                                pregunta: '¿Canta pop en inglés?',
                                si: {
                                    pregunta: '¿Es canadiense?',
                                    si: { resultado: 'Justin Bieber', emoji: '🎸', descripcion: 'Cantante canadiense de pop internacional' },
                                    no: { resultado: 'Harry Styles', emoji: '🎶', descripcion: 'Cantante y ex integrante de One Direction' }
                                },
                                no: {
                                    pregunta: '¿Hace rap o hip-hop?',
                                    si: { resultado: 'Drake', emoji: '🎤', descripcion: 'Rapero y cantante canadiense muy popular' },
                                    no: { resultado: 'The Weeknd', emoji: '🌙', descripcion: 'Cantante canadiense de R&B y pop oscuro' }
                                }
                            }
                        },
                        no: {
                            pregunta: '¿Es pop internacional o fue parte de un grupo famoso?',
                            si: {
                                pregunta: '¿Es conocida principalmente por sus "eras" o discos conceptuales?',
                                si: { resultado: 'Taylor Swift', emoji: '🎸', descripcion: 'Cantante y compositora de pop/country, famosa por sus eras' },
                                no: { resultado: 'Beyoncé', emoji: '👑', descripcion: 'Cantante, compositora y artista icónica estadounidense' }
                            },
                            no: {
                                pregunta: '¿Es latina?',
                                si: { resultado: 'Shakira', emoji: '💃', descripcion: 'Cantante colombiana de pop latino internacional' },
                                no: { resultado: 'Billie Eilish', emoji: '🖤', descripcion: 'Cantante estadounidense de pop alternativo y oscuro' }
                            }
                        }
                    },
                    no: {
                        pregunta: '¿Es actor o actriz?',
                        si: {
                            pregunta: '¿Es hombre?',
                            si: {
                                pregunta: '¿Es famoso por películas de acción o superhéroes?',
                                si: {
                                    pregunta: '¿Interpretó a Iron Man en Marvel?',
                                    si: { resultado: 'Robert Downey Jr.', emoji: '🦾', descripcion: 'Actor ganador del Oscar, famoso por interpretar a Iron Man en el UCM' },
                                    no: { resultado: 'Tom Cruise', emoji: '🎬', descripcion: 'Actor de Hollywood conocido por la saga Mission: Impossible' }
                                },
                                no: {
                                    pregunta: '¿Ganó el Oscar y es conocido por dramas intensos?',
                                    si: { resultado: 'Leonardo DiCaprio', emoji: '🎭', descripcion: 'Actor ganador del Oscar, conocido por Titanic y El Renacido' },
                                    no: { resultado: 'Keanu Reeves', emoji: '🕶️', descripcion: 'Actor famoso por Matrix y la saga John Wick' }
                                }
                            },
                            no: {
                                pregunta: '¿Ha ganado múltiples premios Oscar?',
                                si: { resultado: 'Meryl Streep', emoji: '🎬', descripcion: 'Considerada una de las mejores actrices de Hollywood, con 3 Oscar' },
                                no: { resultado: 'Zendaya', emoji: '✨', descripcion: 'Actriz y cantante conocida por Euphoria, Dune y Spider-Man' }
                            }
                        },
                        no: {
                            pregunta: '¿Es influencer, streamer o creador de contenido?',
                            si: {
                                pregunta: '¿Es famoso en YouTube por retos o donaciones millonarias?',
                                si: { resultado: 'MrBeast', emoji: '💰', descripcion: 'Youtuber más famoso del mundo, conocido por sus retos y donaciones' },
                                no: { resultado: 'Kylie Jenner', emoji: '💄', descripcion: 'Empresaria e influencer, miembro de la familia Kardashian-Jenner' }
                            },
                            no: { resultado: 'Elon Musk', emoji: '🚀', descripcion: 'Empresario, fundador de Tesla y SpaceX, dueño de X (antes Twitter)' }
                        }
                    }
                },
                no: {
                    pregunta: '¿Es deportista profesional?',
                    si: {
                        pregunta: '¿Juega fútbol soccer?',
                        si: {
                            pregunta: '¿Es argentino?',
                            si: { resultado: 'Lionel Messi', emoji: '🐐', descripcion: 'Considerado el mejor futbolista de la historia, campeón del mundo con Argentina 2022' },
                            no: {
                                pregunta: '¿Es brasileño?',
                                si: { resultado: 'Neymar Jr.', emoji: '⚽', descripcion: 'Delantero brasileño, uno de los mejores de su generación' },
                                no: {
                                    pregunta: '¿Es portugués y muy conocido por su físico y su marca personal?',
                                    si: { resultado: 'Cristiano Ronaldo', emoji: '⚡', descripcion: 'Futbolista portugués, uno de los mejores de todos los tiempos, conocido por su dedicación física' },
                                    no: { resultado: 'Kylian Mbappé', emoji: '🔵', descripcion: 'Delantero francés del Real Madrid, considerado el futbolista del futuro' }
                                }
                            }
                        },
                        no: {
                            pregunta: '¿Juega baloncesto (NBA)?',
                            si: {
                                pregunta: '¿Jugó para los Los Angeles Lakers y falleció trágicamente?',
                                si: { resultado: 'Kobe Bryant', emoji: '🏀', descripcion: 'Legendario basquetbolista de los Lakers, conocido como la Mamba Negra' },
                                no: { resultado: 'LeBron James', emoji: '👑', descripcion: 'Considerado uno de los mejores de la NBA de todos los tiempos' }
                            },
                            no: {
                                pregunta: '¿Es boxeador o luchador?',
                                si: { resultado: 'Canelo Álvarez', emoji: '🥊', descripcion: 'Boxeador mexicano campeón mundial en múltiples categorías' },
                                no: { resultado: 'Serena Williams', emoji: '🎾', descripcion: 'Tenista estadounidense, una de las mejores de la historia del deporte' }
                            }
                        }
                    },
                    no: {
                        pregunta: '¿Es empresario o tecnólogo?',
                        si: {
                            pregunta: '¿Fundó una red social masiva?',
                            si: { resultado: 'Mark Zuckerberg', emoji: '📘', descripcion: 'Fundador de Facebook y Meta (Instagram, WhatsApp)' },
                            no: { resultado: 'Jeff Bezos', emoji: '📦', descripcion: 'Fundador de Amazon, uno de los hombres más ricos del mundo' }
                        },
                        no: {
                            pregunta: '¿Es político o líder de gobierno?',
                            si: {
                                pregunta: '¿Fue el primer presidente afroamericano de Estados Unidos?',
                                si: { resultado: 'Barack Obama', emoji: '🇺🇸', descripcion: 'Primer presidente afroamericano de Estados Unidos (2009-2017)' },
                                no: { resultado: 'Xi Jinping / Vladimir Putin', emoji: '🌍', descripcion: 'Líder de una potencia mundial actual' }
                            },
                            no: { resultado: 'Papa Francisco', emoji: '✝️', descripcion: 'Líder espiritual de la Iglesia Católica desde 2013' }
                        }
                    }
                }
            },
            no: {
                pregunta: '¿Es de Latinoamérica o España?',
                si: {
                    pregunta: '¿Es mexicano?',
                    si: {
                        pregunta: '¿Es cantante o artista?',
                        si: { resultado: 'Christian Nodal / Natanael Cano', emoji: '🎶', descripcion: 'Cantante mexicano de regional mexicano o corridos' },
                        no: { resultado: 'Eugenio Derbez', emoji: '😂', descripcion: 'Actor y comediante mexicano con carrera internacional' }
                    },
                    no: {
                        pregunta: '¿Es colombiano?',
                        si: { resultado: 'Carlos Vives / Maluma', emoji: '🎺', descripcion: 'Artista musical colombiano famoso internacionalmente' },
                        no: { resultado: 'Paulo Coelho', emoji: '📖', descripcion: 'Escritor brasileño autor de El Alquimista' }
                    }
                },
                no: {
                    pregunta: '¿Es asiático y del mundo del entretenimiento o tecnología?',
                    si: {
                        pregunta: '¿Pertenece a un grupo de K-pop?',
                        si: { resultado: 'BTS / BLACKPINK (algún miembro)', emoji: '🎤', descripcion: 'Integrante de un famoso grupo de K-pop surcoreano' },
                        no: { resultado: 'Jackie Chan / Bruce Lee', emoji: '🥋', descripcion: 'Actor o artista marcial asiático de fama mundial' }
                    },
                    no: { resultado: 'Adele / Ed Sheeran', emoji: '🎵', descripcion: 'Famoso artista musical británico de pop/soul' }
                }
            }
        },
        no: {
            pregunta: '¿Es de la historia antigua o medieval (antes del siglo XIX)?',
            si: {
                pregunta: '¿Fue gobernante, rey, reina o conquistador?',
                si: {
                    pregunta: '¿Es del Antiguo Egipto?',
                    si: {
                        pregunta: '¿Es mujer?',
                        si: { resultado: 'Cleopatra', emoji: '👸', descripcion: 'Última reina del Antiguo Egipto, famosa por su belleza e inteligencia política' },
                        no: { resultado: 'Ramsés II', emoji: '🏺', descripcion: 'Faraón más famoso del Antiguo Egipto, conocido como Ramsés el Grande' }
                    },
                    no: {
                        pregunta: '¿Fue un conquistador o líder militar de Europa?',
                        si: {
                            pregunta: '¿Es considerado un genio militar del siglo XIX?',
                            si: { resultado: 'Napoleón Bonaparte', emoji: '⚔️', descripcion: 'Emperador francés y estratega militar que conquistó gran parte de Europa' },
                            no: { resultado: 'Alejandro Magno', emoji: '🏛️', descripcion: 'Rey de Macedonia que conquistó el mayor imperio de la Antigüedad' }
                        },
                        no: {
                            pregunta: '¿Es un libertador latinoamericano?',
                            si: { resultado: 'Simón Bolívar / José de San Martín', emoji: '🗡️', descripcion: 'Libertador de países sudamericanos en la independencia' },
                            no: { resultado: 'Julio César', emoji: '🏛️', descripcion: 'General y político romano que marcó la historia del Imperio Romano' }
                        }
                    }
                },
                no: {
                    pregunta: '¿Es científico, artista o filósofo histórico?',
                    si: {
                        pregunta: '¿Es científico o inventor?',
                        si: {
                            pregunta: '¿Su descubrimiento está relacionado con la física?',
                            si: {
                                pregunta: '¿Descubrió la gravedad o las leyes del movimiento?',
                                si: { resultado: 'Isaac Newton', emoji: '🍎', descripcion: 'Físico y matemático inglés que descubrió la ley de la gravedad' },
                                no: { resultado: 'Albert Einstein', emoji: '🧠', descripcion: 'Físico alemán creador de la Teoría de la Relatividad, ganador del Nobel' }
                            },
                            no: {
                                pregunta: '¿Es mujer y ganó el Premio Nobel?',
                                si: { resultado: 'Marie Curie', emoji: '⚗️', descripcion: 'Física y química polaco-francesa, primera mujer en ganar el Premio Nobel' },
                                no: { resultado: 'Charles Darwin', emoji: '🦎', descripcion: 'Naturalista británico que propuso la teoría de la evolución de las especies' }
                            }
                        },
                        no: {
                            pregunta: '¿Es artista plástico o escritor famoso?',
                            si: {
                                pregunta: '¿Pintó la Mona Lisa o la Capilla Sixtina?',
                                si: { resultado: 'Leonardo da Vinci / Miguel Ángel', emoji: '🎨', descripcion: 'Artista y genio del Renacimiento italiano' },
                                no: { resultado: 'William Shakespeare', emoji: '✍️', descripcion: 'Dramaturgo y poeta inglés, autor de Hamlet, Romeo y Julieta, etc.' }
                            },
                            no: { resultado: 'Sócrates / Platón / Aristóteles', emoji: '🏛️', descripcion: 'Filósofo de la Antigua Grecia' }
                        }
                    },
                    no: { resultado: 'Gengis Kan / Atila', emoji: '⚔️', descripcion: 'Líder militar nómada que conquistó enormes territorios' }
                }
            },
            no: {
                pregunta: '¿Es del siglo XX (1900-2000)?',
                si: {
                    pregunta: '¿Es del mundo del espectáculo o la música?',
                    si: {
                        pregunta: '¿Es músico de rock, pop clásico o blues?',
                        si: {
                            pregunta: '¿Es conocido como el Rey del Rock and Roll?',
                            si: { resultado: 'Elvis Presley', emoji: '🎸', descripcion: 'El Rey del Rock and Roll, icono cultural de los años 50-70' },
                            no: {
                                pregunta: '¿Murió joven y forma parte del "Club de los 27"?',
                                si: { resultado: 'Jimi Hendrix / Janis Joplin / Jim Morrison / Kurt Cobain / Amy Winehouse', emoji: '🎸', descripcion: 'Músico legendario fallecido a los 27 años' },
                                no: { resultado: 'Michael Jackson', emoji: '🕺', descripcion: 'El Rey del Pop, uno de los artistas más vendidos de todos los tiempos' }
                            }
                        },
                        no: { resultado: 'Marilyn Monroe / Audrey Hepburn', emoji: '💋', descripcion: 'Actriz icónica del cine clásico de Hollywood del siglo XX' }
                    },
                    no: {
                        pregunta: '¿Es líder político, revolucionario o activista histórico?',
                        si: {
                            pregunta: '¿Luchó por la igualdad racial o los derechos civiles?',
                            si: { resultado: 'Martin Luther King Jr. / Nelson Mandela', emoji: '✊', descripcion: 'Líder de los derechos civiles y la igualdad racial del siglo XX' },
                            no: {
                                pregunta: '¿Es conocido como revolucionario latinoamericano?',
                                si: { resultado: 'Che Guevara / Fidel Castro', emoji: '🌿', descripcion: 'Revolucionario marxista latinoamericano del siglo XX' },
                                no: { resultado: 'Mahatma Gandhi', emoji: '☮️', descripcion: 'Líder espiritual y político indio, símbolo de la resistencia no violenta' }
                            }
                        },
                        no: { resultado: 'Frida Kahlo / Salvador Dalí', emoji: '🌺', descripcion: 'Artista plástico icónico del siglo XX' }
                    }
                },
                no: { resultado: 'Una personalidad histórica poco conocida 🤔', emoji: '🕵️', descripcion: 'No tengo suficiente información sobre este personaje' }
            }
        }
    },
    no: {
        pregunta: '¿Tu personaje es de anime o manga japonés?',
        si: {
            pregunta: '¿Tu personaje tiene poderes o habilidades especiales?',
            si: {
                pregunta: '¿Es el protagonista principal de su historia?',
                si: {
                    pregunta: '¿Es de un anime Shonen muy popular?',
                    si: {
                        pregunta: '¿Su poder principal involucra transformaciones o niveles de poder?',
                        si: {
                            pregunta: '¿Su cabello o energía cambia cuando se transforma?',
                            si: { resultado: 'Goku (Dragon Ball Z/Super)', emoji: '⚡', descripcion: 'Guerrero Saiyan protagonista de Dragon Ball, puede transformarse en Super Saiyan' },
                            no: {
                                pregunta: '¿Vive en un mundo de piratas y comió una fruta del diablo?',
                                si: { resultado: 'Monkey D. Luffy (One Piece)', emoji: '🏴‍☠️', descripcion: 'Capitán de los Piratas del Sombrero de Paja, quiere ser el Rey de los Piratas' },
                                no: { resultado: 'Naruto Uzumaki (Naruto)', emoji: '🍜', descripcion: 'Ninja de Konoha con el espíritu del Zorro de Nueve Colas, sueña con ser Hokage' }
                            }
                        },
                        no: {
                            pregunta: '¿Pelea contra demonios o titanes gigantes?',
                            si: {
                                pregunta: '¿Los enemigos son titanes que se comen humanos?',
                                si: { resultado: 'Eren Yaeger (Shingeki no Kyojin / Attack on Titan)', emoji: '🏔️', descripcion: 'Protagonista de AoT que puede transformarse en titán y busca la libertad' },
                                no: { resultado: 'Tanjiro Kamado (Kimetsu no Yaiba / Demon Slayer)', emoji: '🗡️', descripcion: 'Cazador de demonios que busca salvar a su hermana Nezuko' }
                            },
                            no: {
                                pregunta: '¿Vive en un mundo donde todos tienen un poder único llamado "Quirk"?',
                                si: { resultado: 'Izuku Midoriya / Deku (My Hero Academia)', emoji: '💪', descripcion: 'Joven sin quirk que hereda el One For All para convertirse en el mayor héroe' },
                                no: {
                                    pregunta: '¿Derrota a cualquier enemigo con un solo golpe?',
                                    si: { resultado: 'Saitama (One Punch Man)', emoji: '👊', descripcion: 'Héroe que se hizo tan fuerte que cualquier pelea lo aburre por ganar de un golpe' },
                                    no: { resultado: 'Ichigo Kurosaki (Bleach)', emoji: '⚔️', descripcion: 'Estudiante que se convierte en sustituto Shinigami para proteger a los suyos' }
                                }
                            }
                        }
                    },
                    no: {
                        pregunta: '¿Es de un anime de aventuras, isekai o psicológico?',
                        si: {
                            pregunta: '¿Fue transportado o reencarnado en otro mundo?',
                            si: {
                                pregunta: '¿Está atrapado dentro de un videojuego?',
                                si: { resultado: 'Kirito / Asuna (Sword Art Online)', emoji: '⚔️', descripcion: 'Jugadores atrapados en el videojuego de realidad virtual SAO' },
                                no: { resultado: 'Subaru Natsuki (Re:Zero)', emoji: '🔄', descripcion: 'Joven transportado a otro mundo con el poder de regresar a un punto al morir' }
                            },
                            no: {
                                pregunta: '¿Tiene un cuaderno donde puede escribir el nombre de alguien para matarlo?',
                                si: { resultado: 'Light Yagami (Death Note)', emoji: '📓', descripcion: 'Estudiante brillante que obtiene el Death Note para crear un mundo sin criminales' },
                                no: { resultado: 'Edward Elric (Fullmetal Alchemist Brotherhood)', emoji: '⚗️', descripcion: 'Alquimista estatal que busca la Piedra Filosofal para recuperar su cuerpo y el de su hermano' }
                            }
                        },
                        no: {
                            pregunta: '¿Es de un anime de terror o psicológico extremo?',
                            si: { resultado: 'Shinji Ikari (Neon Genesis Evangelion)', emoji: '🤖', descripcion: 'Joven piloto del Eva-01 en Evangelion, con fuertes problemas psicológicos' },
                            no: { resultado: 'Gon Freecss (Hunter x Hunter)', emoji: '🌿', descripcion: 'Joven que se convierte en Hunter para buscar a su padre, Ging Freecss' }
                        }
                    }
                },
                no: {
                    pregunta: '¿Es el rival principal del protagonista?',
                    si: {
                        pregunta: '¿Es rival de Goku en Dragon Ball?',
                        si: { resultado: 'Vegeta (Dragon Ball Z)', emoji: '👑', descripcion: 'Príncipe de los Saiyans y rival de Goku, uno de los personajes más queridos de DB' },
                        no: {
                            pregunta: '¿Es rival de Naruto?',
                            si: { resultado: 'Sasuke Uchiha (Naruto)', emoji: '🔥', descripcion: 'Último sobreviviente del clan Uchiha y rival/amigo de Naruto' },
                            no: {
                                pregunta: '¿Es el espadachín del grupo de Luffy?',
                                si: { resultado: 'Roronoa Zoro (One Piece)', emoji: '⚔️', descripcion: 'Cazador de piratas y espadachín de los Piratas del Sombrero de Paja' },
                                no: { resultado: 'Levi Ackerman (Attack on Titan)', emoji: '⚔️', descripcion: 'El soldado más poderoso de la humanidad en AoT' }
                            }
                        }
                    },
                    no: {
                        pregunta: '¿Es un villano poderoso o antihéroe?',
                        si: {
                            pregunta: '¿Es el villano de Dragon Ball o de Naruto?',
                            si: { resultado: 'Frieza / Cell / Majin Boo (Dragon Ball) / Madara Uchiha (Naruto)', emoji: '😈', descripcion: 'Icónico villano de un anime Shonen muy famoso' },
                            no: { resultado: 'Aizen (Bleach) / All For One (MHA) / Muzan (Demon Slayer)', emoji: '👿', descripcion: 'Villano principal de un anime popular' }
                        },
                        no: {
                            pregunta: '¿Es una chica protagonista o importante en la historia?',
                            si: {
                                pregunta: '¿Es la hermana convertida en demonio?',
                                si: { resultado: 'Nezuko Kamado (Demon Slayer)', emoji: '🌸', descripcion: 'La hermana de Tanjiro, convertida en demonio que lucha por mantener su humanidad' },
                                no: { resultado: 'Mikasa Ackerman (AoT) / Hinata (Naruto) / Nami (One Piece)', emoji: '🌸', descripcion: 'Personaje femenino clave en un anime shonen popular' }
                            },
                            no: { resultado: 'Kakashi Hatake (Naruto)', emoji: '👁️', descripcion: 'Sensei del Equipo 7, conocido por su Sharingan copiado' }
                        }
                    }
                }
            },
            no: {
                pregunta: '¿Es de un anime de deportes o vida cotidiana?',
                si: {
                    pregunta: '¿Es de un anime de voleibol o baloncesto?',
                    si: { resultado: 'Hinata Shoyo (Haikyuu!!) / Kuroko (Kuroko no Basket)', emoji: '🏐', descripcion: 'Protagonista de un famoso anime de deportes' },
                    no: { resultado: 'Yuri (Yuri on Ice) / Ippo (Hajime no Ippo)', emoji: '⛸️', descripcion: 'Protagonista de anime de deportes individual' }
                },
                no: {
                    pregunta: '¿Es de un anime slice of life, romance o misterio?',
                    si: { resultado: 'Hachiman (Oregairu) / Oreki (Hyouka) / Kousei (Shigatsu)', emoji: '📚', descripcion: 'Protagonista introvertido de un anime de vida cotidiana o drama' },
                    no: { resultado: 'Osamu Dazai (Bungo Stray Dogs)', emoji: '📚', descripcion: 'Miembro de la Agencia de Detectives Armados, basado en el escritor real japonés' }
                }
            }
        },
        no: {
            pregunta: '¿Tu personaje es de un videojuego?',
            si: {
                pregunta: '¿Es de Nintendo?',
                si: {
                    pregunta: '¿Es el protagonista más icónico de Nintendo?',
                    si: {
                        pregunta: '¿Usa overol rojo y rescata a una princesa?',
                        si: { resultado: 'Mario (Super Mario Bros)', emoji: '🍄', descripcion: 'El fontanero más famoso del mundo de los videojuegos, mascota de Nintendo' },
                        no: {
                            pregunta: '¿Lleva orejas de animal y vive en una isla?',
                            si: { resultado: 'Isabelle / Tom Nook (Animal Crossing)', emoji: '🏝️', descripcion: 'Personaje icónico de la saga Animal Crossing' },
                            no: {
                                pregunta: '¿Vive en Hyrule y empuña la espada maestra?',
                                si: { resultado: 'Link (The Legend of Zelda)', emoji: '🗡️', descripcion: 'Héroe de Hyrule de la saga The Legend of Zelda, portador de la Trifuerza del Valor' },
                                no: { resultado: 'Kirby (Kirby series)', emoji: '🌸', descripcion: 'Pequeño ser rosado de Planet Popstar que absorbe los poderes de sus enemigos' }
                            }
                        }
                    },
                    no: {
                        pregunta: '¿Es un Pokémon o entrenador Pokémon?',
                        si: { resultado: 'Pikachu / Ash Ketchum / Red (Pokémon)', emoji: '⚡', descripcion: 'Personaje icónico de la saga Pokémon de Nintendo' },
                        no: { resultado: 'Samus Aran (Metroid) / Captain Falcon (F-Zero)', emoji: '🎮', descripcion: 'Héroe de una saga Nintendo menos conocida' }
                    }
                },
                no: {
                    pregunta: '¿Es de un RPG épico o juego de acción/aventura?',
                    si: {
                        pregunta: '¿Es de un juego con un tono oscuro o adulto?',
                        si: {
                            pregunta: '¿Pelea contra dioses o criaturas mitológicas?',
                            si: {
                                pregunta: '¿Es un espartano convertido en dios de la guerra?',
                                si: { resultado: 'Kratos (God of War)', emoji: '⚡', descripcion: 'Espartano que se convierte en el Dios de la Guerra y mata a los dioses del Olimpo' },
                                no: { resultado: 'Geralt de Rivia (The Witcher)', emoji: '⚔️', descripcion: 'Brujo cazador de monstruos del universo de Andrzej Sapkowski' }
                            },
                            no: {
                                pregunta: '¿Es de The Last of Us o de un juego post-apocalíptico?',
                                si: { resultado: 'Joel / Ellie (The Last of Us)', emoji: '🧟', descripcion: 'Protagonistas del aclamado juego de Naughty Dog' },
                                no: { resultado: 'Arthur Morgan / John Marston (Red Dead Redemption)', emoji: '🤠', descripcion: 'Vaquero protagonista de la saga Red Dead Redemption' }
                            }
                        },
                        no: {
                            pregunta: '¿Es de un JRPG de Square Enix como Final Fantasy?',
                            si: { resultado: 'Cloud Strife (FF VII) / Lightning (FF XIII) / Noctis (FF XV)', emoji: '⚔️', descripcion: 'Protagonista de la icónica saga Final Fantasy de Square Enix' },
                            no: {
                                pregunta: '¿Es de un juego de terror survival?',
                                si: { resultado: 'Leon Kennedy (Resident Evil) / Alan Wake', emoji: '😱', descripcion: 'Protagonista de un famoso juego de terror' },
                                no: { resultado: 'Master Chief (Halo) / Doom Slayer (DOOM)', emoji: '🪖', descripcion: 'Supersoldado protagonista de un shooter épico' }
                            }
                        }
                    },
                    no: {
                        pregunta: '¿Es de un juego de peleas, plataformas o battle royale?',
                        si: {
                            pregunta: '¿Es de Mortal Kombat, Street Fighter o Tekken?',
                            si: { resultado: 'Scorpion / Sub-Zero (MK) / Ryu / Ken (SF) / Jin Kazama (Tekken)', emoji: '👊', descripcion: 'Luchador icónico de una saga de juegos de pelea' },
                            no: {
                                pregunta: '¿Es de Fortnite o Minecraft?',
                                si: { resultado: 'Steve / Creeper (Minecraft) / Jonesy (Fortnite)', emoji: '⛏️', descripcion: 'Personaje de uno de los juegos más populares del mundo' },
                                no: { resultado: 'Lara Croft (Tomb Raider) / Nathan Drake (Uncharted)', emoji: '🏹', descripcion: 'Protagonista aventurero de un juego de acción y exploración' }
                            }
                        },
                        no: {
                            pregunta: '¿Es de Among Us, Undertale o un juego indie famoso?',
                            si: { resultado: 'The Crewmate / Impostor (Among Us) / Sans / Frisk (Undertale)', emoji: '🎮', descripcion: 'Personaje de un famoso juego indie viral' },
                            no: { resultado: 'Atreus (God of War) / Aloy (Horizon)', emoji: '🏹', descripcion: 'Protagonista joven de un juego de aventura épica moderno' }
                        }
                    }
                }
            },
            no: {
                pregunta: '¿Tu personaje es de una película o serie occidental (Hollywood, Netflix, etc.)?',
                si: {
                    pregunta: '¿Es de Marvel o DC Comics?',
                    si: {
                        pregunta: '¿Es de Marvel (MCU)?',
                        si: {
                            pregunta: '¿Tiene armadura tecnológica avanzada?',
                            si: { resultado: 'Iron Man / Tony Stark (Marvel)', emoji: '🦾', descripcion: 'Genio multimillonario con una armadura de hierro, pilar del UCM' },
                            no: {
                                pregunta: '¿Fue picado por una araña radiactiva?',
                                si: { resultado: 'Spider-Man / Peter Parker (Marvel)', emoji: '🕷️', descripcion: 'El amigable vecino Spider-Man, el superhéroe más popular de Marvel' },
                                no: {
                                    pregunta: '¿Es el dios asgardiano del trueno?',
                                    si: { resultado: 'Thor Odinson (Marvel)', emoji: '⚡', descripcion: 'Dios del trueno asgardiano, hijo de Odín y empuñador del Mjolnir' },
                                    no: {
                                        pregunta: '¿Es el supersoldado del escudo vibranio?',
                                        si: { resultado: 'Capitán América / Steve Rogers (Marvel)', emoji: '🛡️', descripcion: 'El primer Vengador, supersoldado de la Segunda Guerra Mundial' },
                                        no: {
                                            pregunta: '¿Es un villano que quiere borrar la mitad del universo?',
                                            si: { resultado: 'Thanos (Marvel)', emoji: '💜', descripcion: 'El Titán Loco, villano que busca el equilibrio del universo con las Gemas del Infinito' },
                                            no: { resultado: 'Loki / Black Widow / Hulk / Thor (Marvel)', emoji: '🌟', descripcion: 'Personaje del Universo Cinematográfico de Marvel' }
                                        }
                                    }
                                }
                            }
                        },
                        no: {
                            pregunta: '¿Es de DC Comics?',
                            si: {
                                pregunta: '¿Es un vigilante sin superpoderes que usa su inteligencia y fortuna?',
                                si: { resultado: 'Batman / Bruce Wayne (DC)', emoji: '🦇', descripcion: 'El Caballero Oscuro, protector de Ciudad Gótica y miembro fundador de la JLA' },
                                no: {
                                    pregunta: '¿Vino de otro planeta y puede volar con superfuerza?',
                                    si: { resultado: 'Superman / Clark Kent (DC)', emoji: '🔴', descripcion: 'El último hijo de Krypton, símbolo de esperanza de DC Comics' },
                                    no: {
                                        pregunta: '¿Es el príncipe payaso del crimen y enemigo de Batman?',
                                        si: { resultado: 'Joker (DC)', emoji: '🃏', descripcion: 'El villano más icónico de DC, archienemigo del Caballero Oscuro' },
                                        no: { resultado: 'Wonder Woman / The Flash / Aquaman (DC)', emoji: '⚡', descripcion: 'Miembro de la Liga de la Justicia de DC Comics' }
                                    }
                                }
                            },
                            no: { resultado: 'Deadpool (Marvel/Fox) / Spawn (Image Comics)', emoji: '💢', descripcion: 'Superhéroe o antihéroe de cómic de una editorial alternativa' }
                        }
                    },
                    no: {
                        pregunta: '¿Es de una saga de ciencia ficción épica?',
                        si: {
                            pregunta: '¿Es de Star Wars?',
                            si: {
                                pregunta: '¿Pertenece al lado oscuro de la Fuerza?',
                                si: {
                                    pregunta: '¿Es el padre del protagonista y usa respirador?',
                                    si: { resultado: 'Darth Vader (Star Wars)', emoji: '🌑', descripcion: 'El Señor Sith más icónico del cine, padre de Luke Skywalker' },
                                    no: { resultado: 'Emperor Palpatine / Kylo Ren / Darth Maul (Star Wars)', emoji: '⚡', descripcion: 'Señor del lado oscuro del universo de Star Wars' }
                                },
                                no: {
                                    pregunta: '¿Es el joven Jedi protagonista de la trilogía original?',
                                    si: { resultado: 'Luke Skywalker (Star Wars)', emoji: '⚡', descripcion: 'Jedi protagonista de la trilogía original de Star Wars, hijo de Vader' },
                                    no: {
                                        pregunta: '¿Es el pequeño maestro Jedi verde muy sabio?',
                                        si: { resultado: 'Yoda (Star Wars)', emoji: '🟢', descripcion: 'El Gran Maestro Jedi, uno de los más poderosos usuarios de la Fuerza' },
                                        no: { resultado: 'Han Solo / Obi-Wan Kenobi / Rey (Star Wars)', emoji: '🚀', descripcion: 'Personaje importante de la saga galáctica Star Wars' }
                                    }
                                }
                            },
                            no: {
                                pregunta: '¿Es de una saga de ciencia ficción con Matrix, Terminator o similares?',
                                si: { resultado: 'Neo (Matrix) / T-800 Terminator / Ellen Ripley (Alien)', emoji: '🔴', descripcion: 'Protagonista icónico de una película de ciencia ficción clásica' },
                                no: { resultado: 'Spock / James T. Kirk (Star Trek)', emoji: '🖖', descripcion: 'Personaje de la famosa franquicia de Star Trek' }
                            }
                        },
                        no: {
                            pregunta: '¿Es de una saga de fantasía épica?',
                            si: {
                                pregunta: '¿Es del universo de Harry Potter?',
                                si: {
                                    pregunta: '¿Es el protagonista con la cicatriz en forma de rayo?',
                                    si: { resultado: 'Harry Potter', emoji: '⚡', descripcion: 'El niño que sobrevivió, protagonista del mundo mágico creado por J.K. Rowling' },
                                    no: {
                                        pregunta: '¿Es el señor tenebroso al que todos temen nombrar?',
                                        si: { resultado: 'Voldemort / Lord Voldemort (Harry Potter)', emoji: '🐍', descripcion: 'El Señor Tenebroso, villano principal de la saga Harry Potter' },
                                        no: { resultado: 'Hermione Granger / Dumbledore / Snape (Harry Potter)', emoji: '📚', descripcion: 'Personaje importante de la saga del mundo mágico de Harry Potter' }
                                    }
                                },
                                no: {
                                    pregunta: '¿Es de El Señor de los Anillos o El Hobbit?',
                                    si: {
                                        pregunta: '¿Es el portador del Anillo Único?',
                                        si: { resultado: 'Frodo Baggins (LOTR)', emoji: '💍', descripcion: 'Hobbit de la Comarca, portador del Anillo Único en su travesía a Mordor' },
                                        no: {
                                            pregunta: '¿Es el mago con bastón que dice "No pasarás"?',
                                            si: { resultado: 'Gandalf el Gris/Blanco (LOTR)', emoji: '🧙', descripcion: 'El mago más sabio de la Tierra Media, guía de la Comunidad del Anillo' },
                                            no: { resultado: 'Aragorn / Legolas / Gimli / Sauron (LOTR)', emoji: '⚔️', descripcion: 'Personaje importante de la Tierra Media en LOTR' }
                                        }
                                    },
                                    no: { resultado: 'Jon Snow / Daenerys Targaryen / Tyrion Lannister (Game of Thrones)', emoji: '🐉', descripcion: 'Personaje principal de la saga de Juego de Tronos / House of the Dragon' }
                                }
                            },
                            no: {
                                pregunta: '¿Es de una película de animación Disney, Pixar o DreamWorks?',
                                si: {
                                    pregunta: '¿Es una princesa Disney?',
                                    si: {
                                        pregunta: '¿Tiene poderes de hielo y puede crear cosas con nieve?',
                                        si: { resultado: 'Elsa (Frozen)', emoji: '❄️', descripcion: 'La Reina de las Nieves con poderes de hielo de la película Frozen de Disney' },
                                        no: {
                                            pregunta: '¿Navega el océano en una isla polinesia?',
                                            si: { resultado: 'Moana (Moana / Vaiana)', emoji: '🌊', descripcion: 'Joven polinesia elegida por el océano que emprende una aventura épica' },
                                            no: { resultado: 'Rapunzel / Mérida / Mulan / Tiana (Disney Princess)', emoji: '👸', descripcion: 'Princesa de una película animada de Disney' }
                                        }
                                    },
                                    no: {
                                        pregunta: '¿Es de Toy Story?',
                                        si: { resultado: 'Woody / Buzz Lightyear / Jessie (Toy Story)', emoji: '🤠', descripcion: 'Juguetes protagonistas de la saga Toy Story de Pixar' },
                                        no: {
                                            pregunta: '¿Es el rey de las bestias y vive en África?',
                                            si: { resultado: 'Simba (El Rey León)', emoji: '🦁', descripcion: 'Príncipe y rey de la selva africana en El Rey León de Disney' },
                                            no: { resultado: 'Shrek / Fiona / El Burro (Shrek - DreamWorks)', emoji: '🟢', descripcion: 'Ogro protagonista de la famosa saga de animación de DreamWorks' }
                                        }
                                    }
                                },
                                no: {
                                    pregunta: '¿Es un personaje de serie de televisión muy famosa?',
                                    si: {
                                        pregunta: '¿Es el protagonista de una serie de crimen o drama oscuro?',
                                        si: {
                                            pregunta: '¿Cocina metanfetaminas para hacerse rico?',
                                            si: { resultado: 'Walter White / Heisenberg (Breaking Bad)', emoji: '🧪', descripcion: 'Profesor de química convertido en el más temido fabricante de drogas' },
                                            no: { resultado: 'Tony Soprano (Sopranos) / Dexter / Don Draper (Mad Men)', emoji: '🎭', descripcion: 'Protagonista antihéroe de una serie dramática aclamada' }
                                        },
                                        no: {
                                            pregunta: '¿Es de una sitcom o comedia famosa?',
                                            si: { resultado: 'Sheldon Cooper (Big Bang Theory) / Michael Scott (The Office) / Homer Simpson', emoji: '😂', descripcion: 'Personaje cómico icónico de una serie de TV muy popular' },
                                            no: { resultado: 'Eleven (Stranger Things) / The Mandalorian / Beth Dutton (Yellowstone)', emoji: '📺', descripcion: 'Protagonista de una serie de streaming muy popular' }
                                        }
                                    },
                                    no: {
                                        pregunta: '¿Es de una película de terror clásica?',
                                        si: { resultado: 'Freddy Krueger / Jason Voorhees / Michael Myers / Pennywise / Ghostface', emoji: '🔪', descripcion: 'Villano icónico de una saga de películas de terror de Hollywood' },
                                        no: { resultado: 'James Bond / Indiana Jones / John Wick / Ethan Hunt', emoji: '🕵️', descripcion: 'Protagonista de una saga de acción o espionaje del cine clásico' }
                                    }
                                }
                            }
                        }
                    }
                },
                no: {
                    pregunta: '¿Tu personaje es de un libro, cómic o historia clásica?',
                    si: {
                        pregunta: '¿Es de un libro de literatura universal?',
                        si: {
                            pregunta: '¿Es un detective famoso de ficción?',
                            si: { resultado: 'Sherlock Holmes / Hercule Poirot / Sam Spade', emoji: '🔍', descripcion: 'Detective icónico de la literatura de misterio' },
                            no: {
                                pregunta: '¿Es de literatura hispana o latinoamericana?',
                                si: { resultado: 'Don Quijote de la Mancha / Macondo (Cien Años de Soledad)', emoji: '⚔️', descripcion: 'Personaje de una obra cumbre de la literatura en español' },
                                no: { resultado: 'Dracula / Frankenstein / El Fantasma de la Ópera', emoji: '🧛', descripcion: 'Monstruo clásico de la literatura de terror o gótica' }
                            }
                        },
                        no: {
                            pregunta: '¿Es de la mitología griega, nórdica o azteca?',
                            si: {
                                pregunta: '¿Es de la mitología griega o romana?',
                                si: { resultado: 'Zeus / Ares / Poseidón / Hades / Hércules / Perseo', emoji: '⚡', descripcion: 'Dios o héroe de la mitología griega o romana' },
                                no: { resultado: 'Odín / Loki / Thor (mitología nórdica) / Quetzalcóatl (azteca)', emoji: '🐍', descripcion: 'Deidad de la mitología nórdica o mesoamericana' }
                            },
                            no: { resultado: 'Asterix / Tintín / Lucky Luke (cómic europeo)', emoji: '🛡️', descripcion: 'Personaje icónico de un cómic europeo clásico' }
                        }
                    },
                    no: {
                        pregunta: '¿Es un personaje meme, de internet o cultura pop reciente?',
                        si: { resultado: 'Pepe la Rana / Doge / El Gato con Sombrero (de meme) / Among Us crewmate', emoji: '🐸', descripcion: 'Personaje icónico de los memes o la cultura de internet' },
                        no: { resultado: '¡No adivino! 😤\n\nׅㅤ𓏸𓈒ㅤׄ *¿En quién pensabas?* Dime para aprender 😄', emoji: '🤔', descripcion: 'Este personaje me ganó, no pude adivinarlo' }
                    }
                }
            }
        }
    }
}

// ============= ESTADO DE PARTIDAS =============
if (!global.akiGames) global.akiGames = new Map()

// ============= HANDLER =============
const handler = async (m, { conn, command, usedPrefix }) => {
    const rcanal  = await getRcanal()
    const chatId  = m.chat
    const userId  = m.sender
    const gameKey = `${chatId}_${userId}`

    // ===============================================================
    // SI / NO — solo activos si el usuario tiene partida activa
    // Si no está jugando → no responder absolutamente nada
    // ===============================================================
    if (command === 'si' || command === 'yes' || command === 'no') {
        // No hay partida activa → ignorar completamente
        if (!global.akiGames.has(gameKey)) return

        const g    = global.akiGames.get(gameKey)
        const rama = (command === 'si' || command === 'yes') ? 'si' : 'no'
        const sig  = g.nodo[rama]

        // Nodo hoja → adivinamos
        if (sig?.resultado) {
            global.akiGames.delete(gameKey)
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ʟᴏ ꜱé!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜${sig.emoji}* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀꜱᴏɴᴀᴊᴇ* :: *${sig.resultado}*
ׅㅤ𓏸𓈒ㅤׄ *ᴅᴇꜱᴄ* :: _${sig.descripcion}_
ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇɢᴜɴᴛᴀꜱ* :: ${g.preguntaNum}
ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${userId.split('@')[0]}

ׅㅤ𓏸𓈒ㅤׄ *¿ᴀᴄᴇʀᴛé?* :: \`${usedPrefix}siacerte\` ᴏ \`${usedPrefix}noacerte\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
                contextInfo: { mentionedJid: [userId], ...rcanal }
            }, { quoted: m })
        }

        // Árbol sin más ramas
        if (!sig?.pregunta) {
            global.akiGames.delete(gameKey)
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ɴᴏ ᴀᴅɪᴠɪɴᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😤* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴍᴇ ɢᴀɴᴀꜱᴛᴇ* :: ¿ᴇɴ ǫᴜɪéɴ ᴘᴇɴꜱᴀʙᴀꜱ? 😄\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        // Avanzar nodo
        g.historial.push(rama)
        g.nodo = sig
        g.preguntaNum++

        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ᴀᴋɪɴᴀᴛᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔮* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇɢᴜɴᴛᴀ* :: ${g.preguntaNum}
ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${userId.split('@')[0]}

> ## \`❓\`

_${sig.pregunta}_

ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴏɴᴅᴇ* :: \`${usedPrefix}si\` ᴏ \`${usedPrefix}no\`
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴄᴇʟᴀʀ* :: \`${usedPrefix}stopaki\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { mentionedJid: [userId], ...rcanal }
        }, { quoted: m })
    }

    // ===============================================================
    // INICIAR JUEGO
    // ===============================================================
    if (command === 'akinator' || command === 'aki') {
        // Ya tiene partida activa
        if (global.akiGames.has(gameKey)) {
            const g = global.akiGames.get(gameKey)
            return conn.sendMessage(m.chat, {
                text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ᴘᴀʀᴛɪᴅᴀ ᴀᴄᴛɪᴠᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜⚠️* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴘʀᴇɢᴜɴᴛᴀ ${g.preguntaNum}* :: _${g.nodo.pregunta}_\n\nׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴏɴᴅᴇ* :: \`${usedPrefix}si\` ᴏ \`${usedPrefix}no\`\nׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴄᴇʟᴀʀ* :: \`${usedPrefix}stopaki\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
                contextInfo: { ...rcanal }
            }, { quoted: m })
        }

        global.akiGames.set(gameKey, {
            nodo: arbol,
            preguntaNum: 1,
            historial: [],
            userId,
            startedAt: Date.now()
        })

        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ᴀᴋɪɴᴀᴛᴏʀ!*

*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🔮* ㅤ֢ㅤ⸱ㅤᯭִ*

ׅㅤ𓏸𓈒ㅤׄ *ᴊᴜɢᴀᴅᴏʀ* :: @${userId.split('@')[0]}
ׅㅤ𓏸𓈒ㅤׄ *ɪɴꜱᴛʀᴜᴄᴄɪᴏɴᴇꜱ* :: ᴘɪᴇɴꜱᴀ ᴇɴ ᴜɴ ᴘᴇʀꜱᴏɴᴀᴊᴇ ʏ ʀᴇꜱᴘᴏɴᴅᴇ ꜱᴏʟᴏ ᴄᴏɴ ꜱí ᴏ ɴᴏ
ׅㅤ𓏸𓈒ㅤׄ *ᴘᴇʀꜱᴏɴᴀᴊᴇꜱ* :: ʀᴇᴀʟᴇꜱ, ᴀɴɪᴍᴇ, ᴄɪɴᴇ, ᴊᴜᴇɢᴏꜱ, ʜɪꜱᴛᴏʀɪᴀ...

> ## \`ᴘʀᴇɢᴜɴᴛᴀ 1 🎯\`

_${arbol.pregunta}_

ׅㅤ𓏸𓈒ㅤׄ *ʀᴇꜱᴘᴏɴᴅᴇ* :: \`${usedPrefix}si\` ᴏ \`${usedPrefix}no\`
ׅㅤ𓏸𓈒ㅤׄ *ᴄᴀɴᴄᴇʟᴀʀ* :: \`${usedPrefix}stopaki\`

> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`.trim(),
            contextInfo: { mentionedJid: [userId], ...rcanal }
        }, { quoted: m })
    }

    // ===============================================================
    // CANCELAR
    // ===============================================================
    if (command === 'stopaki' || command === 'cancelaraki') {
        if (!global.akiGames.has(gameKey)) return
        global.akiGames.delete(gameKey)
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ᴊᴜᴇɢᴏ ᴄᴀɴᴄᴇʟᴀᴅᴏ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🏁* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴊᴜᴇɢᴏ ᴛᴇʀᴍɪɴᴀᴅᴏ\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    // ===============================================================
    // CONFIRMACIÓN ACIERTO
    // ===============================================================
    if (command === 'siacerte') {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ꜱᴀʙíᴀ ǫᴜᴇ ᴇʀᴀ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🎉* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ¡ᴀᴄᴇʀᴛé! 😄\nׅㅤ𓏸𓈒ㅤׄ *ᴏᴛʀᴀ ᴘᴀʀᴛɪᴅᴀ* :: \`${usedPrefix}akinator\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }

    if (command === 'noacerte') {
        return conn.sendMessage(m.chat, {
            text: `> . ﹡ ﹟ 🔮 ׄ ⬭ *¡ᴍᴇ ɢᴀɴᴀꜱᴛᴇ!*\n\n*ㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜😤* ㅤ֢ㅤ⸱ㅤᯭִ*\n\nׅㅤ𓏸𓈒ㅤׄ *ᴇꜱᴛᴀᴅᴏ* :: ᴇꜱᴛᴀ ᴠᴇᴢ ᴍᴇ ɢᴀɴᴀꜱᴛᴇ 😅\nׅㅤ𓏸𓈒ㅤׄ *¿ᴇɴ ǫᴜɪéɴ ᴘᴇɴꜱᴀʙᴀꜱ?* :: ᴅíᴍᴇ ᴘᴀʀᴀ ᴀᴘʀᴇɴᴅᴇʀ\nׅㅤ𓏸𓈒ㅤׄ *ᴏᴛʀᴀ ᴘᴀʀᴛɪᴅᴀ* :: \`${usedPrefix}akinator\`\n\n> . ﹡ ﹟ ⚡ ׄ ⬭ *ᴀsᴛᴀ-ʙᴏᴛ-ᴍᴅ*`,
            contextInfo: { ...rcanal }
        }, { quoted: m })
    }
}

handler.help = ['akinator', 'aki']
handler.tags = ['fun', 'games']
handler.command = ['akinator', 'aki', 'si', 'yes', 'no', 'stopaki', 'cancelaraki', 'siacerte', 'noacerte']
handler.group = true
handler.reg = true

export default handler