# Bayus ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
Bayus is a Discord bot that assists with the administration of The Bunk3r server.

---

# Overview
## Information
/`channels`, /`information` and /`rules` provide embeds with information and server rules, and are only posted in the information channels.

## Backup
/`backup` provides administrative tools to create, query, upload, and delete backups for a particular server:

- /`backup` `create`: creates a full server backup in a `JSON` file, including channels, roles, emojis, and up to 10 messages per channel.
- /`backup` `information`: displays the details of an existing backup, showing the ID, server, size, and creation date.
- /`backup` `load`: loads a backup onto a server, deleting its current structure and completely replacing it with the one from the backup.
- /`backup` `delete`: permanently deletes an existing backup using its ID.

## Emojis
Bayus has commands to copy emojis from one server to another, and to copy all emojis from a given server, save them in a `JSON` file to be able to load them into another server:

- /`stealemoji`: gets the emoji from a string option and creates a URL to obtain the source. Then, the new emoji is uploaded to the server with a given name.
- /`transferemojis` `copy`: stores the URL and name of all emojis from the server where it's executed into a `JSON` file.
- /`transferemojis` `paste`: uploads the emojis from the `JSON` file to the server where it's executed, using the URL to fetch the source, and the name to create the new emoji ID. The Discord API only
allows uploading 50 emojis per hour, so the execution process may take a considerable amount of time.
