import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import competitionTypeModel from "../models/competitionTypeModel.js";

config();

const seedCompTypes = [
  {
    Name: "Junior Singing",
    Description: [
        "Junior Singing is a competition for participants aged 8-15 years.",
        "The preliminary round is an online selection stage.",
        "The competition is individual-based.",
        "Participants MUST create a video of themselves singing a Mandarin song with a maximum duration of 5 minutes (counted from the start of the music intro), in .mp4 format, and in a 16:9 landscape orientation.",
        "The song performed must be a modern song (流⾏歌曲). Participants are free to sing any song as long as it is in Mandarin.",
        "Participants MUST introduce themselves by stating only their name and the song title before starting their performance, without any cuts.",
        "Participants MUST submit a one-take video recorded from a single position/angle, without edits or merging multiple clips, including the introduction and live singing performance.",
        "The video MUST clearly show the participant's face up to their waist (half-body) and must be the participant's original work.",
        "If a participant is seen reading the lyrics while singing in the video, points will be deducted by the judges under the interpretation assessment criteria.",
        "Participants are NOT allowed to dub their voices; the audio in the video must be clear for the judges to evaluate.",
        "The committee is not responsible for obtaining licensing from the copyright holders of any song. Therefore, participants are not advised to arrange or modify the composition of a song UNLESS they have obtained the necessary permissions and licenses themselves, including paying royalties to the song's owner (if applicable). If a participant rearranges a song without permission, the committee is NOT responsible for their decision.",
        "The background music must be instrumental or self-played, as long as the participant's voice remains clearly audible.",
        "Participants are NOT allowed to use any voice effects or filters such as reverb, autotune, tempo adjustments, or karaoke apps like Smule, TikTok, or similar applications that can alter their natural voice.",
        "The submitted video MUST NOT contain any elements related to ethnicity, religion, race, intergroup conflict (SARA), pornography, or violence.",
        "The submitted video MUST NOT have been previously published or entered in any other competition. Once submitted, the video becomes the property of BNMC and may be published.",
        "Participants MUST upload their video to a Google Drive folder following a specific naming format.",
        "Format: COMPETITION_CODE_NMC 2024_SONG_TITLE_FULL NAME_PARTICIPANT_NUMBER.",
        "Example: LSJ_NMC 2024_⼩幸运_NOVELINA_001.",
        "LSJ - Junior Singing Competition.",
        "It is recommended that the song title be written in Hanzi, but the participant's name must be in Indonesian.",
        "Participants MUST set the Google Drive link to be accessible to the judges.",
        "The deadline for video submission is Sunday, September 15, 2024, via the following form submission: bit.ly/FormSubmissionNMC2024.",
        "If a participant violates the rules or fails to submit their video for any reason, they will be DISQUALIFIED. Any delays are not the responsibility of the committee.",
        "A participant's video will only be considered valid if they have registered and completed the payment, which will be confirmed by the NMC 2024 contact person.",
        "Each participant is only allowed to submit one (1) competition video.",
        "Participants are NOT allowed to revise or replace their video submission, even if it is within the submission period, UNLESS requested by the committee.",
        "The competition will be judged by a panel of three (3) judges.",
        "The judges' decisions are FINAL and cannot be contested.", 
        "The announcement of the preliminary round results will take place on Sunday, September 29, 2024, through the NMC participants' WhatsApp group.",
        "Finalists will be invited to Jakarta for a technical meeting, which will be held on Friday, October 11, 2024, at 1:00 PM until completion."
    ],
    Price: 180000,
    Venue: "Online (Preliminary) and Binus@AlamSutera Jakarta (Final)",
    CompetitionDate: {
        StartDate: new Date("2024-07-29T00:00:00Z"),
        EndDate: new Date("2024-09-15T20:00:00Z"),
        FinalDate: new Date("2024-10-12T09:00:00Z")
    },
    MainPrize: [
        "Participant: Participant e-certificate",
        "Finalist: Finalist physical certificate",
        "1st Winner: Physical certificate + trophy + Rp 1.000.000,- money prize",
        "2nd Winner: Physical certificate + trophy + Rp 800.000,- money prize",
        "3rd Winner: Physical certificate + trophy + Rp 600.000,- money prize",
    ],
    GradingAspect: [
        "The judging criteria for the Singing Competition at NMC 2024 are as follows: vocal technique (35%), pronunciation (30%), interpretation (25%), and stage presence (10%).",
        "Vocal technique includes intonation (pitch accuracy), breathing, phrasing (sentence segmentation), tempo accuracy, and additional techniques such as vibrato (vocal trembling), improvisation (modifying part of the melody), and others.",
        "Pronunciation refers to the participant's ability to sing each word with proper articulation and clear pronunciation (without reading lyrics).",
        "Body language includes the participant's posture and gestures while singing, such as hand movements and other body movements that support the performance but should not be excessive.",
        "Interpretation covers the participant's expression while performing the song, delivering the message, and conveying the song's atmosphere.",
        "Stage presence includes wearing neat and appropriate clothing as well as proper body language."
    ],
  },
  {
    Name: "Senior Singing",
    Description: [
        "Senior Singing is a competition for participants aged 16-24 years.",
        "The preliminary round is an online selection stage.",
        "The competition is individual-based.",
        "Participants MUST create a video of themselves singing a Mandarin song with a maximum duration of 5 minutes (counted from the start of the music intro), in .mp4 format, and in a 16:9 landscape orientation.",
        "The song performed must be a modern song (流⾏歌曲). Participants are free to sing any song as long as it is in Mandarin.",
        "Participants MUST introduce themselves by stating only their name and the song title before starting their performance, without any cuts.",
        "Participants MUST submit a one-take video recorded from a single position/angle, without edits or merging multiple clips, including the introduction and live singing performance.",
        "The video MUST clearly show the participant's face up to their waist (half-body) and must be the participant's original work.",
        "If a participant is seen reading the lyrics while singing in the video, points will be deducted by the judges under the interpretation assessment criteria.",
        "Participants are NOT allowed to dub their voices; the audio in the video must be clear for the judges to evaluate.",
        "The committee is not responsible for obtaining licensing from the copyright holders of any song. Therefore, participants are not advised to arrange or modify the composition of a song UNLESS they have obtained the necessary permissions and licenses themselves, including paying royalties to the song's owner (if applicable). If a participant rearranges a song without permission, the committee is NOT responsible for their decision.",
        "The background music must be instrumental or self-played, as long as the participant's voice remains clearly audible.",
        "Participants are NOT allowed to use any voice effects or filters such as reverb, autotune, tempo adjustments, or karaoke apps like Smule, TikTok, or similar applications that can alter their natural voice.",
        "The submitted video MUST NOT contain any elements related to ethnicity, religion, race, intergroup conflict (SARA), pornography, or violence.",
        "The submitted video MUST NOT have been previously published or entered in any other competition. Once submitted, the video becomes the property of BNMC and may be published.",
        "Participants MUST upload their video to a Google Drive folder following a specific naming format.",
        "Format: COMPETITION_CODE_NMC 2024_SONG_TITLE_FULL NAME_PARTICIPANT_NUMBER.",
        "Example: LSS_NMC 2024_⼩幸运_NOVELINA_001.",
        "LSS - Senior Singing Competition.",
        "It is recommended that the song title be written in Hanzi, but the participant's name must be in Indonesian.",
        "Participants MUST set the Google Drive link to be accessible to the judges.",
        "The deadline for video submission is Sunday, September 15, 2024, via the following form submission: bit.ly/FormSubmissionNMC2024.",
        "If a participant violates the rules or fails to submit their video for any reason, they will be DISQUALIFIED. Any delays are not the responsibility of the committee.",
        "A participant's video will only be considered valid if they have registered and completed the payment, which will be confirmed by the NMC 2024 contact person.",
        "Each participant is only allowed to submit one (1) competition video.",
        "Participants are NOT allowed to revise or replace their video submission, even if it is within the submission period, UNLESS requested by the committee.",
        "The competition will be judged by a panel of three (3) judges.",
        "The judges' decisions are FINAL and cannot be contested.", 
        "The announcement of the preliminary round results will take place on Sunday, September 29, 2024, through the NMC participants' WhatsApp group.",
        "Finalists will be invited to Jakarta for a technical meeting, which will be held on Friday, October 11, 2024, at 1:00 PM until completion."
    ],
    Price: 200000,
    Venue: "Online (Preliminary) and Binus@AlamSutera Jakarta (Final)",
    CompetitionDate: {
        StartDate: new Date("2024-07-29T00:00:00Z"),
        EndDate: new Date("2024-09-15T20:00:00Z"),
        FinalDate: new Date("2024-10-12T09:00:00Z")
    },
    MainPrize: [
        "Participant: Participant e-certificate",
        "Finalist: Finalist physical certificate",
        "1st Winner: Physical certificate + trophy + Rp 1.200.000,- money prize",
        "2nd Winner: Physical certificate + trophy + Rp 1.000.000,- money prize",
        "3rd Winner: Physical certificate + trophy + Rp 800.000,- money prize",
    ],
    GradingAspect: [
        "The judging criteria for the Singing Competition at NMC 2024 are as follows: vocal technique (35%), pronunciation (30%), interpretation (25%), and stage presence (10%).",
        "Vocal technique includes intonation (pitch accuracy), breathing, phrasing (sentence segmentation), tempo accuracy, and additional techniques such as vibrato (vocal trembling), improvisation (modifying part of the melody), and others.",
        "Pronunciation refers to the participant's ability to sing each word with proper articulation and clear pronunciation (without reading lyrics).",
        "Body language includes the participant's posture and gestures while singing, such as hand movements and other body movements that support the performance but should not be excessive.",
        "Interpretation covers the participant's expression while performing the song, delivering the message, and conveying the song's atmosphere.",
        "Stage presence includes wearing neat and appropriate clothing as well as proper body language."
    ],
  },
  {
    Name: "Storytelling",
    Description: [
        "Storytelling competition is a competition for participants aged 13-21 years.",
        "The preliminary round is an online selection stage.",
        "The competition is individual-based.",
        "Participants MUST create a video of themselves telling a story in Mandarin with a duration of 3 to 4 minutes in .mp4 format, and in a 16:9 landscape orientation.",
        "Participants MUST choose one of the two themes determined by the committee for the preliminary round:",
        "The first theme is Chinese Idiom Stories (中国成语故事)",
        "China has many idioms. Idioms are a series of words or phrases that have a certain implied meaning that cannot be interpreted literally. Some examples of Chinese idioms are 画蛇添足, 掩耳盗铃, 对牛弹琴, 狐假虎威.",
        "The second theme is The Origin of Chinese Cuisine (中餐的起源)",
        "China has a wide variety of traditional foods. Each dish has its own ingredients, cooking techniques, and origin story. Some examples of Chinese specialties are 粽子, 包子, 八宝粥.",
        "Participants MUST introduce themselves by stating only their name, theme, and story title before starting their performance.",
        "Participants MUST submit a video recorded in one take from a single position/angle, not a compilation of multiple videos, including the introduction video.",
        "Videos MUST NOT be in selfie format and MUST clearly show the participant's face down to the waist (half-body) and be the participant's original work.",
        "Participants are allowed to use accessories and props in their competition video.",
        "Participants are NOT allowed to read a script. If a participant is found reading a script, points will be deducted according to the rules.",
        "Participants are NOT allowed to use dubbing but may use background music, provided that the participant's voice in the video remains clear for judging.",
        "The competition video MUST NOT contain elements of SARA (ethnicity, religion, race, and intergroup relations), pornography, or violence.",
        "The submitted video MUST NOT have been previously published or competed in any other competition. The submitted video will become the property of BNMC for publication.",
        "Participants MUST upload their video to a Google Drive folder using the following naming format:",
        "COMPETITION_CODE_NMC 2024_THEME_TITLE_FULL_NAME_PARTICIPANT_NUMBER",
        "Example: [LST]_NMC 2024_中国成语故事_掩耳盗铃_NOVELINA_001",
        "The theme and title should preferably be written in Hanzi, while the participant's name must be in Indonesian. Participants MUST ensure that the Google Drive link is accessible to the judges.",
        "The deadline for video submission is Sunday, September 15, 2024, through the submission form: bit.ly/FormSubmissionNMC2024",
        "Participants who violate the rules or fail to submit their video for any reason will be DISQUALIFIED. Any delay is not the responsibility of the committee.",
        "The participant's video will be considered valid only if they have registered and completed the payment, which will be confirmed by the NMC 2024 contact person.",
        "Each participant is only allowed to submit their competition video once. Participants are NOT allowed to revise or replace the video even if the submission deadline has not yet passed, UNLESS requested by the committee.",
        "The competition will be judged by a panel of three (3) judges.",
        "The judges' decisions are FINAL and cannot be contested.",
        "The preliminary round results will be announced on Sunday, September 29, 2024, via the NMC participant WhatsApp group.",
        "Finalists will be invited to Jakarta for a technical meeting on Friday, October 11, 2024, at 13:00 until completion."
       
    ],
    Price: 200000,
    Venue: "Online (Preliminary) and Binus@AlamSutera Jakarta (Final)",
    CompetitionDate: {
        StartDate: new Date("2024-07-29T00:00:00Z"),
        EndDate: new Date("2024-09-15T20:00:00Z"),
        FinalDate: new Date("2024-10-12T09:00:00Z")
    },
    MainPrize: [
        "Participant: Participant e-certificate",
        "Finalist: Finalist physical certificate",
        "1st Winner: Physical certificate + trophy + Rp 1.200.000,- money prize",
        "2nd Winner: Physical certificate + trophy + Rp 1.000.000,- money prize",
        "3rd Winner: Physical certificate + trophy + Rp 800.000,- money prize",
    ],
    GradingAspect: [
        "Storytelling competition grading criteria for NMC 2024: Story content (15%), Grammar and vocabulary (15%), Pronunciation and intonation (30%), Expression and interpretation (20%), Appearance (10%), and Time efficiency (10%).",
        "The story content must align with the theme and have a clear narrative structure.",
        "Grammar and vocabulary refer to the participant's ability to use proper language and words to clearly convey the story to the audience.",
        "Pronunciation and intonation assess the participant's ability to articulate each word with the correct tone and pronunciation (without reading a script).",
        "Expression and interpretation evaluate how expressively the participant delivers the story, using appropriate gestures, facial expressions, and immersing themselves in the character roles.",
        "Appearance includes neat and appropriate clothing, eye contact, and body language.",
        "Using props relevant to the theme is allowed.",
        "Time efficiency measures the participant's ability to manage the allocated time properly within the 3-4 minute duration."
    ],
  },
  {
    Name: "Speech",
    Description: [
        "Speech competition is a competition for participants aged 13-21 years.",
        "The preliminary round is an online selection stage.",
        "The competition is individual-based.",
        "Participants MUST create a video of themselves delivering a speech in Mandarin with a duration of 3 to 4 minutes in .mp4 format, and in a 16:9 landscape orientation.",
        "Participants MUST choose one of the two themes determined by the committee for the preliminary round:",
        "The first theme is The Power of Language: How Mandarin Can Unite Generations and Cultures (语言的力量：普通话如何统一不同年代和文化)",
        "This theme explores how Mandarin can unite different generations and cultures. Mandarin facilitates communication across generations, strengthens family bonds, and enhances cross-cultural understanding. Through this language, we bridge gaps and reinforce connections among people from diverse backgrounds.",
        "The second theme is Old Stories, New Interpretations: The Meaning of Chinese Tradition in Today's Life (老故事，新解读：中国传统在今日生活中的意义)",
        "This theme explores how ancient Chinese stories gain new meanings in modern life. Traditional Chinese tales often carry values that are still relevant today. By reinterpreting these stories, we can uncover how old traditions offer insights and inspiration for contemporary living.",
 
        "Participants MUST introduce themselves by stating only their name and speech theme before starting the presentation.",
        "Participants MUST submit a video recorded in one take from a single position/angle, without combining multiple videos, including the introduction.",
        "The video MUST NOT be a selfie and MUST clearly show the participant's face up to the waist (half-body) and be an original work of the participant.",
        "Participants are NOT allowed to add subtitles to the video.",
        "The speech script MUST be original, created by the participant, and NOT taken from websites or other people's works.",
        "Participants are NOT allowed to read a script. If a participant is found reading a script, points will be deducted from the presentation and expression criteria according to the established rules.",
        "Participants are NOT allowed to use dubbing, and the voice in the video must be clear enough to be assessed by the judges.",
        "The competition video MUST NOT contain elements of ethnicity, religion, race, inter-group conflict (SARA), pornography, or violence.",
        "The submitted video MUST NOT have been published or used in any previous competition. The submitted video will become the property of BNMC for publication.",
        "Participants MUST upload the video along with the speech script in Microsoft Word format to a Google Drive folder with the following naming format:",
        "Format: COMPETITION_CODE_NMC 2024_THEME_FULL_NAME_PARTICIPANT_NUMBER",
        "Example: [LSP]_NMC 2024_语言的力量:普通话如何统一不同年代和文化_NOVELINA_001",

        "It is recommended to write the theme in Hanzi, while the participant's name must be in Indonesian.",
        "Participants MUST ensure the Google Drive link is accessible to the judges.",
        "Submission deadline is Sunday, September 15, 2024, via the submission form: bit.ly/FormSubmissionNMC2024",
        "Failure to comply with the rules or failure to submit the video for any reason will result in DISQUALIFICATION. Delays are not the responsibility of the committee.",
        "The participant's video will be considered valid only if they have registered and completed payment, which will be confirmed by the NMC 2024 contact person.",
        "Each participant is only allowed to submit one (1) competition video. Participants are NOT allowed to revise or replace the video, even if it is still within the submission period, UNLESS requested by the committee.",
        "The competition will be judged by a panel of three (3) judges.",
        "The judges' decisions are FINAL and cannot be contested.",
        
        "The preliminary round results will be announced on Sunday, September 29, 2024, via the NMC participant WhatsApp group.",
        "Finalists will be invited to Jakarta for a technical meeting on Friday, October 11, 2024, at 1:00 PM WIB."
    ],
    Price: 200000,
    Venue: "Online (Preliminary) and Binus@AlamSutera Jakarta (Final)",
    CompetitionDate: {
        StartDate: new Date("2024-07-29T00:00:00Z"),
        EndDate: new Date("2024-09-15T20:00:00Z"),
        FinalDate: new Date("2024-10-12T09:00:00Z")
    },
    MainPrize: [
        "Participant: Participant e-certificate",
        "Finalist: Finalist physical certificate",
        "1st Winner: Physical certificate + trophy + Rp 1.200.000,- money prize",
        "2nd Winner: Physical certificate + trophy + Rp 1.000.000,- money prize",
        "3rd Winner: Physical certificate + trophy + Rp 800.000,- money prize",
    ],
    GradingAspect: [
        "Speech competition assessment criteria for NMC 2024: Pronunciation (30%), Intonation (20%), Expression and Engagement (20%), Appearance (5%), Time Efficiency (10%), and Speech Content (15%)",
        "Pronunciation: The participant must pronounce each word accurately and clearly (without reading a script).",
        "Intonation: The participant must pronounce each word with the appropriate tone and meaning.",
        "Expression and Engagement: The participant must deeply understand the speech content, convey messages effectively, display appropriate expressions, and create the right atmosphere for the audience.",
        "Appearance: Includes neat and appropriate attire, eye contact, body language, and other aspects.",
        "Time Efficiency: The participant must allocate time appropriately, keeping the speech within the required 3–4 minutes.",
        "Speech Content: The participant must structure the speech according to the theme with a clear framework (introduction, main content, and conclusion) and use correct grammar."
    ],
  },
  {
    Name: "Poster Design Contest",
    Description: [
        "Poster Design Contest is a competition for participants aged 16-24 years.",
        "The content is an online selection contest.",
        "The competition is individual-based.",
        "This poster design competition theme invites participants to depict how traditional elements of China, such as art, culture, and architecture, blend with modern aspects like technology and contemporary lifestyles. Participants should illustrate how the mix of tradition and modernity creates a unique identity for present-day China.)",
        "Participants MUST submit a poster design according to the theme set by the committee.",
        "Participants can design the poster using Adobe Photoshop, Adobe Illustrator, CorelDraw, or other vector-based design applications. They can also draw on paper, but it must be scanned and may include additional effects, so the final design is in digital format.",
        "The poster size must be 210 mm x 297 mm.",
        "The orientation of the poster must be portrait.",
        "The poster design submitted must be the participant's own work. Participants are not allowed to use images/photos/design elements that violate copyright.",
        "The poster design submitted must not contain elements of ethnicity, religion, race, inter-group conflict (SARA), pornography, or violence.",
        "Participants MUST include the source(s) used (if any) to avoid plagiarism.",
        "The poster design submitted must not have been published or used in any previous competitions. The work submitted will become the property of BNMC for publication.",
        "Participants MUST submit the poster design along with the title and caption explaining the poster to minimize copyright violations. The title and caption are allowed only in Indonesian or Chinese (Hanzi).",
        "The caption must be at least 30 words and no more than 100 words.",
        "The poster design must be uploaded to a Google Drive folder containing the poster file in (.JPG) or (.JPEG) format, the title and caption in Microsoft Word, and a time-lapse video of the creation process recorded with another device.",
        "It is recommended to use Hanzi for the theme, but the participant’s name must be in Indonesian. Participants MUST open the Google Drive link for the judges to access.",
        "Format for Folder: COMPETITION_CODE_NMC 2024_THEME_TITLE_NAME_PARTICIPANT_NUMBER_REGION. Example: LPD_NMC 2024_传统与现代的交融：我眼中的中国_EVOLUSI_CHINA_NOVELINA_001_PONTIANAK",
        "Format for Caption: POSTER_CAPTION_NMC 2024_THEME_TITLE_NAME_PARTICIPANT_NUMBER_REGION. Example: POSTER_CAPTION_NMC 2024_传统与现代的交融：我眼中的中国_EVOLUSI_CHINA_NOVELINA_001_PONTIANAK",
        "Participants MUST record and submit a time-lapse video showing the creation process from start to finish using another device.",
        "The submission deadline for the link is Sunday, September 15, 2024, via the submission form: bit.ly/FormSubmissionNMC2024",
        "Failure to comply with the rules or failure to submit the video for any reason will result in DISQUALIFICATION. Delays are not the responsibility of the committee.",
        "The work will be considered valid if the participant has registered and made the payment, which will be confirmed by the NMC 2024 contact person.",
        "Each participant may submit only one (1) competition video. Participants are NOT allowed to revise or replace the work, even if it is within the submission period, UNLESS requested by the committee.",
        "The competition will be judged by a panel of three (3) judges.",
        "The judges' decisions are FINAL and cannot be contested.",
        "Valid works will be uploaded to the Official NMC Instagram (@nmcbnmc) on Sunday, September 29, 2024.",
        "The winners will be announced on Saturday, October 12, 2024, onsite at the BINUS @Alam Sutera campus."       
    ],
    Price: 75000,
    Venue: "Online and Binus@AlamSutera Jakarta (Winner Announcement)",
    CompetitionDate: {
        StartDate: new Date("2024-07-29T00:00:00Z"),
        EndDate: new Date("2024-09-15T20:00:00Z"),     
    },
    MainPrize: [
        "Participant: Participant e-certificate",
        "1st Winner: Physical certificate + trophy + Rp 600.000,- money prize",
        "2nd Winner: Physical certificate + trophy + Rp 400.000,- money prize",
        "Favorite Winner: Physical certificate + trophy + Rp 200.000,- money prize",
    ],
    GradingAspect: [
        "The judging criteria for the poster design contest at NMC 2024 are as follows: Relevance to the theme (20%), Originality (30%), Message conveyed (20%), and Poster content (30%).",
        "Relevance to the theme means the participant can design work that is connected to the competition theme, both in terms of poster content and other components.",
        "Originality means the participant's work shows individual creativity, does not contain plagiarism, and does not use ideas or works of others.",
        "Message conveyed means the participant can design informative work with a meaning that aligns with the theme and display short words as a message on the poster.",
        "Poster content includes visual values or the participant's ability to design the poster using interesting objects like poster colors, font types, images, illustrations, and other elements based on individual creativity."
    ],
  },
  {
    Name: "Dubbing Contest",
    Description: [
        "Dubbing Contest is a competition for participants aged 16-24 years.",
        "The content is an online selection contest.",
        "The contest can be individual or in groups, with a maximum of 3 people per group.",
        "Participants MUST create a Mandarin dubbing video with a duration of 2-3 minutes, including an introduction, in (.mp4) format and in landscape orientation.",
        "Participants MUST prepare 1 video clip from a cartoon/animation/film/live-action series that uses Mandarin, which will be dubbed by the participant.",
        "Participants MUST introduce themselves by stating their name, the title of the video clip being dubbed, and the origin of the video clip.",
        "The dubbing video must be a one-take recording from a single position/angle, not a combination of multiple videos, including the introduction.",
        "The video MUST clearly show the participant's face up to the chest.",
        "The final video submitted must be a combination of the original video clip (muted) and the participant's dubbing in the upper right corner.",
        "Participants are NOT allowed to use microphones or any amplifying devices during the recording; participants may use wired earphones as assistance.",
        "Participants are NOT allowed to add any background sound; the voice in the video must be clear and original from the recording without added sound effects.",
        "The submitted dubbing video MUST be the participant's original work. Participants are NOT allowed to use videos that violate copyright or manipulate the video.",
        "The submitted video must not contain elements of ethnicity, religion, race, inter-group conflict (SARA), pornography, or violence.",
        "The video submitted MUST NOT have been published or used in any previous competitions. The video submitted will become the property of BNMC for publication.",
        "Participants MUST upload 2 (two) videos: 1 (one) original video clip (unmuted) and 1 (one) dubbed video to a Google Drive folder with the following file naming format:",
        "Format: COMPETITION_CODE_NMC 2024_VIDEO_TITLE_PARTICIPANT_NAME_PARTICIPANT_NUMBER/TEAM. Example: [LDB]_NMC 2024_云之羽_NOVELINA_001",
        "Format for Original Clip: ORIGINAL CLIP_NMC 2024_VIDEO_TITLE_PARTICIPANT_NAME_PARTICIPANT_NUMBER/TEAM. Example: ORIGINAL CLIP_NMC 2024_云之羽_NOVELINA_001",
        "The video title should be written in Hanzi, but the participant's name should be in Indonesian. Participants MUST open the Google Drive link for judges to access.",
        "The submission deadline for the link is Sunday, September 15, 2024, via the submission form: bit.ly/FormSubmissionNMC2024",
        "Failure to comply with the rules or failure to submit the video for any reason will result in DISQUALIFICATION. Delays are not the responsibility of the committee.",
        "The video will be considered valid if the participant has registered and made the payment, which will be confirmed by the contact person.",
        "Each participant is allowed to submit only one (1) competition video.",
        "Participants are NOT allowed to revise or replace the video, even if it is within the submission period, UNLESS requested by the committee.",
        "The contest will be judged by a panel of three (3) judges.",
        "The judges' decisions are FINAL and cannot be contested.",
        "Valid videos will be uploaded to the Official NMC Instagram (@nmcbnmc) on Sunday, September 29, 2024.",
        "The winners will be announced on Saturday, October 12, 2024, onsite at the BINUS @Alam Sutera campus."
    ],
    Price: 120000,
    Venue: "Online and Binus@AlamSutera Jakarta (Winner Announcement)",
    CompetitionDate: {
        StartDate: new Date("2024-07-29T00:00:00Z"),
        EndDate: new Date("2024-09-15T20:00:00Z")
    },
    MainPrize: [
        "Participant: Participant e-certificate",
        "1st Winner: Physical certificate + trophy + Rp 1.500.000,- money prize",
        "2nd Winner: Physical certificate + trophy + Rp 1.200.000,- money prize",
        "3rd Winner: Physical certificate + trophy + Rp 1.000.000,- money prize",
    ],
    GradingAspect: [
        "The judging criteria for the dubbing contest at NMC 2024 are as follows: Articulation and intonation (35%), Expression and emotional immersion (30%), Timing and synchronization (25%), and Creativity (10%).",
        "Articulation and intonation refer to the participant's ability to pronounce each word clearly using the correct tone so that it can be understood by the audience.",
        "Expression and emotional immersion refer to the participant's ability to express the character's feelings and emotions based on the context of the scene.",
        "Timing and synchronization refer to the participant's ability to deliver the dialogue at the right time, neither too fast nor too slow compared to the original scene, and their ability to mimic the character's lip movements during dialogue.",
        "Creativity refers to the participant's ability to express the character with vocal variations, such as tone changes or unique modulation, while remaining relevant to the character."
    ],
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await competitionTypeModel.insertMany(seedCompTypes);
    console.log("Database comp type seeded successfully");
  } 
  catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();