require("dotenv").config()
const express = require("express")
const path = require("path")
const app = express()
const { json } = require("body-parser")
app.use(json())

const cloudinary = require("cloudinary")
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})
const { Client } = require("discord.js")
const client = new Client({ intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_PRESENCES"] })

const config = {
  guild: "778894052799545355",
  staff: "816054426615152661",
  prefix: "ab!",
}

const api = express.Router()

api.get("/", (req, res) => {
  res.sendStatus(200)
})

api.get("/folder", async (req, res) => {
  let root = await cloudinary.v2.api.root_folders()
  res.json(root)
})

api.get("/tags", async (req, res) => {
  let tagData = await cloudinary.v2.api.tags()
  res.json(tagData.tags)
})

api.post("/addtag", async (req, res) => {
  let done = await cloudinary.v2.uploader.add_tag(req.body.tag, req.body.image, {})
  res.json(done)
})

api.get("/backgrounds", async (req, res) => {
  let bg = await cloudinary.v2.api.resources({ tags: true })
  let sendData = []
  bg.resources.forEach((x) => {
    if (x.public_id.startsWith("amaribackgrounds")) {
      sendData.push({ name: x.public_id.replace("amaribackgrounds/", ""), url: x.secure_url, format: x.format, tags: x.tags })
    }
  })
  res.json(sendData)
})

api.get("/staff", async (req, res) => {
  let staffIds = PO
  res.json(staffIds)
})

app.use("/api", api)

app.use(express.static(path.join(__dirname, "client/build")))
app.use(express.static(path.join(__dirname, "public")))

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"))
})

app.listen(process.env.PORT)
console.log("AmariBackgrounds has been started, port " + process.env.PORT)

client.on("ready", () => console.log("Discord is connected, using " + client.user.tag))

client.on("messageCreate", async (message) => {
  console.log(message.content)
  const args = message.content.slice(config.prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()
  if (commandName == "eval") {
    if (!["439223656200273932"].includes(message.author.id)) return
    try {
      if (!args[0]) return message.channel.send("undefined", { code: "js" })

      let codeArr = args.slice(0).join(" ").split("\n")
      if (!codeArr[codeArr.length - 1].startsWith("return")) codeArr[codeArr.length - 1] = `return ${codeArr[codeArr.length - 1]}`

      const code = `async () => { ${codeArr.join("\n")} }`

      let out = await eval(code)()

      message.channel.send(`Typeof output: **${typeof out}**`)
      if (typeof out !== "string") out = require("util").inspect(out)
      out = out.replace(process.env.TOKEN, "[TOKEN REDACTED]").replace(process.env.CLOUDINARY_SECRET, "[CLOUDINARY_SECRET REDACTED]")

      message.channel.send({
        content: out ? out : "null",
        split: true,
        code: "js",
      })
    } catch (err) {
      message.channel.send("An error occurred when trying to execute this command.")
      console.log(err)
      return message.channel.send(`${err}`, { code: "js" })
    }
  }
})

client.login(process.env.TOKEN)
